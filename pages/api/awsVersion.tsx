export default async function handler(req, res) {
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { getHashedName, getNameAccountKey, NameRegistryState } from "@bonfida/spl-name-service";


const SOL_TLD_AUTHORITY = new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx");


let connection = new Connection(clusterApiUrl("mainnet-beta"));

    const query = req.query
    console.log('query: ', query)
    const hashedName = await getHashedName(query.name);
    const domainKey = await getNameAccountKey( hashedName,undefined, SOL_TLD_AUTHORITY);
    const { registry, nftOwner } = await NameRegistryState.retrieve(connection,domainKey);
    const domainPublicKey = registry.owner?.toBase58()
    const nftOwnerKey = nftOwner?.toBase58()
    console.log(domainPublicKey)

    if (!query.name ) {
      return res.status(400).json({ data: 'Name not found' })
    }
  
    res.status(200).json({ data: `${query.name}`, publicKey: `${domainPublicKey}`, nftOwner: `${nftOwnerKey}` })
  }