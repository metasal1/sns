import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
const SOL_TLD_AUTHORITY = new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx");
import { getHashedName, getNameAccountKey, NameRegistryState } from "@bonfida/spl-name-service";
let connection = new Connection(clusterApiUrl("mainnet-beta"));
export default async function handler(req, res) {
    const query = req.query
    const hashedName = await getHashedName(query.name);
    const domainKey = await getNameAccountKey( hashedName,undefined, SOL_TLD_AUTHORITY);
    const { registry, nftOwner } = await NameRegistryState.retrieve(connection,domainKey);
    const domainPublicKey = registry.owner?.toBase58()
    const nftOwnerKey = nftOwner?.toBase58()
    if (!query.name ) {
      return res.status(400).json({ data: 'Name not provided' })
    }  
    res.status(200).json({ data: `${query.name}`, publicKey: `${domainPublicKey}`, nftOwner: `${nftOwnerKey}` })
  }