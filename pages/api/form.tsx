import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
export const SOL_TLD_AUTHORITY = new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx");

import { getHashedName, getNameAccountKey, NameRegistryState } from "@bonfida/spl-name-service";

let connection = new Connection(clusterApiUrl("mainnet-beta"));

export default async function handler(req, res) {
    const body = req.body
    console.log('body: ', body)
    const hashedName = await getHashedName(body.domainName);
    const domainKey = await getNameAccountKey( hashedName,undefined, SOL_TLD_AUTHORITY);
    const { registry, nftOwner } = await NameRegistryState.retrieve(connection,domainKey);
    const domainPublicKey = registry.owner.toBase58()
    console.log(domainPublicKey)

    if (!body.domainName ) {
      return res.status(400).json({ data: 'Name not found' })
    }
  
    res.status(200).json({ data: `${body.domainName}`, publicKey: `${domainPublicKey}` })
  }