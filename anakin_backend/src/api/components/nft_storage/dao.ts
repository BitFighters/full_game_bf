// const fs = require("fs");
// import { NFTStorage, File, Blob} from 'nft.storage';
// import { Token } from 'nft.storage/dist/src/lib/interface';
// // import { Blob } from "buffer";


// // const mime = require("mime")
// // const path = require("path")

// const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGM4N0JDQzNEZTNkM0Y3QkI5QTdlMzY5Mjc0NTQ4MDJGZjFkNGU0ZjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NTU2MDk4NDczMCwibmFtZSI6ImJpdGZpZ2h0ZXJzLWRldiJ9.i2zJyZJhVdhCb7csm_yVy8uKq-_2bJwf-wtZbX5pMX4'
// const client = new NFTStorage({
//   token: NFT_STORAGE_TOKEN
// })

// export class NFTStorageDao {
//   static async storeNFT(imageBuffer: Buffer, user_wallet: string, attributes: Array<{ trait_type: string; value: string; }>): Promise<string> {
//     const imageFile = new File([ imageBuffer ], `${user_wallet}.png` , { type: 'image/png' })
//     console.log(attributes, imageFile);
//     let  metadata: any;
//     try {
//       console.log("sending ")
//       metadata = await client.store({
//         name: 'BitFighter.',
//         description: 'Your cool BitFighter.',
//         image: imageFile,
//         attributes,
//         // image: new Blob([imageBuffer])
//       })
//       console.log("metadata ", metadata)
//     } catch (err) {
//       console.log(err)
//       return "";
//     } 
//     return metadata.url;
//   }
// }




