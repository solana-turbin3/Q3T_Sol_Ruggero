import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://arweave.net/ZEJ0tqIP5mUMRENT6JqsGSuwZs-zwbg-gDp2zqAs6iE";
    const metadata = {
      name: "WBA - LSD RUG!",
      image: image,
      properties: {
        files: [
          {
            uri: image,
            type: "image/jpeg",
          },
        ],
      },
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
        },
      ],
    };
    const myUri = await umi.uploader.uploadJson(metadata).catch((err) => {
      throw new Error(err);
    });
    console.log("Your metadata URI:", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
