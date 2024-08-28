import { Web3Dao } from "./../web3/dao";
import {
  BASE_ASSETS_PATH,
  BASE_ASSETS_PATH_CUTIE_BOTS,
  height,
  LayerWiseBodyPartsV3,
  NFT_ASSETS_PATH,
  NFT_FOLDER_NAME,
  width,
} from "@config/bitfighter_nft_config";
import fs from "fs";
import { Canvas, createCanvas, loadImage, registerFont } from "canvas";
// import { NFTStorageDao } from "../nft_storage/dao";
import { s3upload } from "@services/s3";
import BITFIGHTER_NFT_SPECS from "@models/bitfighter_nft_specs";
import {
  genrateRandomAttributeV4,
  IAttributes,
} from "./randomAttributeCreator";
import { getMyDateFromDate } from "./utils";
import {
  BITFIGHTER_MINTED,
  GetBitfightersWeb2UserLastMintedIdRedisKey,
} from "@utils/bitfighter_nft_specs";
import { WEB_3_CONFIG } from "@config/web3_config";
import { USER_TYPE } from "@utils/user_details";
import { isNullOrUndefined } from "util";
import { mapper } from "@services/db/connection";
import { ANAKIN_LOGGER } from "@services/logger";
import { v4 as uuidv4 } from "uuid";
import { AES, enc } from "crypto-js";
import { randomNickNameGenarate } from "@utils/random";
import { RedClient } from "@services/redis";
import WALLET_DB from "@models/wallet";

registerFont("Cooper Black Regular.ttf", { family: "Cooper Black" });

export class GeneratorDao {
  // static async createBitfighterV2(user_wallet: string, referer_address: string, user_type: USER_TYPE) {
  //   const {randomDNA, parts_images_relation} = this.createRandomDNA();
  //   const attributesMap: IAttributes =  genrateRandomAttribute();
  //   const attributes = this.createAttributes(randomDNA, attributesMap);
  //   const spriteImageCanvas: Canvas = await this.createSpriteImageFromParts(randomDNA, user_wallet, parts_images_relation);
  //   const spriteImage = spriteImageCanvas.toBuffer('image/png');
  //   fs.writeFileSync(`./${user_wallet}_${randomDNA}_hero1.png`, spriteImage);
  //   const nftImage: Buffer = await this.createNFTImage(attributesMap, user_wallet, randomDNA);
  //   console.log("3---------------nftImage-------------------")
  //   const profileImage: Buffer = await this.createProfileImage(attributesMap, user_wallet, randomDNA);
  //   const firstFrameImage: Buffer = await this.createFirstFrameImage(attributesMap, user_wallet, randomDNA);
  //   fs.writeFileSync(`./${user_wallet}_${randomDNA}_profile.png`, firstFrameImage);
  //   console.log("3---------------profile image-------------------")

  //   // fs.writeFileSync(`./${user_wallet}_${randomDNA}_hero2.png`, nftImage);
  //   // fs.writeFileSync(`./${user_wallet}_${randomDNA}_hero3.png`, profileImage);

  //   // console.log("sending 1");
  //   const {ipfsURL, profile_image} = await this.uploadNftDataToS3(spriteImage, nftImage, user_wallet, attributes, randomDNA, profileImage, firstFrameImage);
  //   // ipfsURL = await NFTStorageDao.storeNFT(base64ImgData, user_wallet, attributes);
  //   // console.log("4----------------------------------", ipfsURL)
  //   // if (user_type === USER_TYPE.WEB2) {
  //   //   await BITFIGHTER_NFT_SPECS.putDataInTable(user_wallet, randomDNA, ipfsURL, WEB_3_CONFIG.CONTRACT_ADDRESS, referer_address, 0, "", profile_image, user_type, BITFIGHTER_MINTED.MINTED);
  //   // } else {
  //   //   await BITFIGHTER_NFT_SPECS.putDataInTable(user_wallet, randomDNA, ipfsURL, WEB_3_CONFIG.CONTRACT_ADDRESS, referer_address, 0, "", profile_image, user_type, BITFIGHTER_MINTED.NOT_MINTED);
  //   // }

  //   // await BITFIGHTER_NFT_SPECS.putDataInTable(user_wallet, randomDNA, ipfsURL, WEB_3_CONFIG.CONTRACT_ADDRESS, referer_address, 0, "", profile_image, user_type, BITFIGHTER_MINTED.NOT_MINTED);

  //   // console.log("5----------------------------------")
  //   return {
  //     // ipfsURL: "as"
  //     ipfsURL
  //   }
  // }

  static async createBitfighterV3(
    user_wallet: string,
    referer_address: string,
    user_type: USER_TYPE,
    partnerName = "Bit Fighter",
    isDripTattoo = false
  ) {
    const { randomDNA, parts_images_relation, paths, totalRp } =
      this.createRandomDnaV3(isDripTattoo);

    console.log("hashing .. ");
    let hashPath = AES.encrypt(
      JSON.stringify(paths),
      "VADER_ZZ_HASH"
    ).toString();
    // console.log(hashPath)

    var bytes = AES.decrypt(hashPath, "VADER_ZZ_HASH");
    var decryptedPath = JSON.parse(bytes.toString(enc.Utf8));
    console.log("decryptedPath ", decryptedPath);

    let totalPower = 0;
    let nftType = "";
    if (totalRp <= 25) {
      totalPower = 20;
      nftType = "Common";
    } else if (totalRp <= 36) {
      totalPower = 20;
      nftType = "Uncommon";
    } else {
      totalPower = 21;
      nftType = "Rare";
    }
    if (user_type === USER_TYPE.WEB2) {
      totalPower = 20;
      nftType = "Common";
      try {
        let data = await WALLET_DB.createWalletForUser(user_wallet)
        data.web2_balance = 100 * 100;
        await mapper.update(data)
      } catch (err) {
        //
      }
    }
    console.log("------nfttype ---", nftType);

    const { attributesMap, dressAttributes } = genrateRandomAttributeV4(
      totalPower,
      decryptedPath
    );
    let new_attributes = { ...attributesMap, ...dressAttributes };
    const attributes = this.createAttributesV2(randomDNA, new_attributes);
    const spriteImageCanvas: Canvas = await this.createSpriteImageFromPartsV3(
      randomDNA,
      user_wallet,
      decryptedPath
    );
    const spriteImage = spriteImageCanvas.toBuffer("image/png");
    fs.writeFileSync(
      `./test_images/${user_wallet}_${randomDNA}_hero1.png`,
      spriteImage
    );
    // console.log("3---------------debug-------------------")
    // console.log("****** ", attributesMap)
    const nftImage: Buffer = await this.createNFTImageV4(
      attributesMap,
      user_wallet,
      randomDNA,
      nftType.toLowerCase(),
      partnerName,
      totalPower
    );
    // console.log("3---------------nftImage-------------------")
    const profileImage: Buffer = await this.createProfileImage(
      attributes,
      user_wallet,
      randomDNA
    );
    const firstFrameImage: Buffer = await this.createFirstFrameImage(
      attributes,
      user_wallet,
      randomDNA
    );
    // fs.writeFileSync(`./test_images/${user_wallet}_${randomDNA}_profile.png`, firstFrameImage);
    // console.log("3---------------profile image-------------------")
    // fs.writeFileSync(`./test_images2/${user_wallet}_${randomDNA}_nftImage.png`, nftImage);
    // fs.writeFileSync(`./test_images/${user_wallet}_${randomDNA}_profileImage.png`, profileImage);
    // const ipfsURL = "abhishek"
    const { ipfsURL, profile_image } = await this.uploadNftDataToS3(
      spriteImage,
      nftImage,
      user_wallet,
      attributes,
      randomDNA,
      profileImage,
      firstFrameImage,
      totalPower,
      hashPath,
      nftType,
      totalRp
    );

    if (user_type === USER_TYPE.WEB2) {
      let leastNumber = await Web3Dao.fetchBitfightersLeastWeb2EntryInRedis();
      console.log("debug------", leastNumber);
      if (leastNumber === 1) {
        leastNumber = 0;
      }
      await BITFIGHTER_NFT_SPECS.putDataInTable(
        user_wallet,
        // randomDNA,
        ipfsURL,
        WEB_3_CONFIG.CONTRACT_ADDRESS,
        referer_address,
        Math.floor(Math.random() * 100),
        randomNickNameGenarate(),
        leastNumber - 1,
        USER_TYPE.WEB2
      );
      await RedClient.deleteKey(GetBitfightersWeb2UserLastMintedIdRedisKey());
      await Web3Dao.fetchBitfightersLeastWeb2EntryInRedis();
    }

    // ipfsURL = await NFTStorageDao.storeNFT(base64ImgData, user_wallet, attributes);
    // return {
    //   // ipfsURL: "abhishek"
    //   ipfsURL
    // }
    return ipfsURL;
  }

  static async createPartnerFighter(
    user_wallet: string,
    referer_address: string,
    user_type: USER_TYPE,
    partnerName = "cutie",
  ) {
    const { randomDNA, parts_images_relation, paths, totalRp } =
      this.createPartnerDNA(partnerName);

    // console.log("hashing .. ");
    let hashPath = AES.encrypt(
      JSON.stringify(paths),
      "VADER_ZZ_HASH"
    ).toString();
    // console.log(hashPath)

    var bytes = AES.decrypt(hashPath, "VADER_ZZ_HASH");
    var decryptedPath = JSON.parse(bytes.toString(enc.Utf8));
    console.log("decryptedPath ", decryptedPath);

    let totalPower = 0;
    let nftType = "";
    if (totalRp <= 25) {
      totalPower = 20;
      nftType = "Common";
    } else if (totalRp <= 36) {
      totalPower = 20;
      nftType = "Uncommon";
    } else {
      totalPower = 21;
      nftType = "Rare";
    }
    if (user_type === USER_TYPE.WEB2) {
      totalPower = 20;
      nftType = "Common";
    }
    console.log("------nfttype ---", nftType);

    const { attributesMap, dressAttributes } = genrateRandomAttributeV4(
      totalPower,
      decryptedPath
    );
    let new_attributes = { ...attributesMap, ...dressAttributes };
    const attributes = this.createAttributesV2(randomDNA, new_attributes);
    const spriteImageCanvas: Canvas = await this.createSpriteImageFromPartsV3(
      randomDNA,
      user_wallet,
      decryptedPath
    );
    const spriteImage = spriteImageCanvas.toBuffer("image/png");
    fs.writeFileSync(
      `./test_images/${user_wallet}_${randomDNA}_hero1.png`,
      spriteImage
    );
    // console.log("3---------------debug-------------------")
    // console.log("****** ", attributesMap)
    const nftImage: Buffer = await this.createNFTImageV4(
      attributesMap,
      user_wallet,
      randomDNA,
      nftType.toLowerCase(),
      partnerName,
      totalPower
    );
    // console.log("3---------------nftImage-------------------")
    const profileImage: Buffer = await this.createProfileImage(
      attributes,
      user_wallet,
      randomDNA
    );
    const firstFrameImage: Buffer = await this.createFirstFrameImage(
      attributes,
      user_wallet,
      randomDNA
    );
    const { ipfsURL, profile_image } = await this.uploadNftDataToS3(
      spriteImage,
      nftImage,
      user_wallet,
      attributes,
      randomDNA,
      profileImage,
      firstFrameImage,
      totalPower,
      hashPath,
      nftType,
      totalRp
    );

    // if (user_type === USER_TYPE.WEB2) {
    //   let leastNumber = await Web3Dao.fetchBitfightersLeastWeb2EntryInRedis();
    //   console.log("debug------", leastNumber);
    //   if (leastNumber === 1) {
    //     leastNumber = 0;
    //   }
    //   await BITFIGHTER_NFT_SPECS.putDataInTable(
    //     user_wallet,
    //     // randomDNA,
    //     ipfsURL,
    //     WEB_3_CONFIG.CONTRACT_ADDRESS,
    //     referer_address,
    //     -1,
    //     randomNickNameGenarate(),
    //     leastNumber - 1,
    //     USER_TYPE.WEB2
    //   );
    //   await RedClient.deleteKey(GetBitfightersWeb2UserLastMintedIdRedisKey());
    //   await Web3Dao.fetchBitfightersLeastWeb2EntryInRedis();
    // }

    // ipfsURL = await NFTStorageDao.storeNFT(base64ImgData, user_wallet, attributes);
    // return {
    //   // ipfsURL: "abhishek"
    //   ipfsURL
    // }
    // return "abhishek"
    return ipfsURL;
  }

  static async createBitfighterV3Admin(user_wallet: string, referer_address: string, user_type: USER_TYPE, partnerName = "Bit Fighter", isDripTattoo = false) {
    // const {randomDNA, parts_images_relation, paths, totalRp} = this.createRandomDnaV3(isDripTattoo);

    // console.log("hashing .. ")
    console.log("-----")
    let paths = ["abc"]
    let hashPath = AES.encrypt(JSON.stringify(paths), "VADER_ZZ_HASH").toString()

    var bytes = AES.decrypt(hashPath, 'VADER_ZZ_HASH');
    var decryptedPath = JSON.parse(bytes.toString(enc.Utf8));
    console.log("decryptedPath ", decryptedPath);

    let totalRp = 20;
    let randomDNA = "dr_bits_2"

    let totalPower = 0;
    let nftType = ""
    if (totalRp <= 25) {
      totalPower = 20;
      nftType = "Common"
    }
    else if (totalRp <= 36) {
      totalPower = 20;
      nftType = "Uncommon"
    } else {
      totalPower = 21;
      nftType = "Rare"
    }
    console.log("------nfttype ---", nftType)

    const { attributesMap, dressAttributes } = genrateRandomAttributeV4(totalPower, decryptedPath);
    let new_attributes = { ...attributesMap, ...dressAttributes };
    // console.log("all attributes .. ", new_attributes)
    const attributes = this.createAttributesV2(randomDNA, new_attributes);

    let spriteImageCanvas = createCanvas(width, height);
    let ctx = spriteImageCanvas.getContext("2d");
    let image = await loadImage('./src/assets/onwer_images/DrBitz.png');
    ctx.drawImage(image, 0, 0)
    const spriteImage = spriteImageCanvas.toBuffer('image/png');
    fs.writeFileSync(`./test_images/${user_wallet}_${randomDNA}_hero1.png`, spriteImage);
    const nftImage: Buffer = await this.createNFTImageV4(attributesMap, user_wallet, randomDNA, nftType.toLowerCase(), partnerName, totalPower);
    // console.log("3---------------nftImage-------------------")
    const profileImage: Buffer = await this.createProfileImage(attributes, user_wallet, randomDNA);
    const firstFrameImage: Buffer = await this.createFirstFrameImage(attributes, user_wallet, randomDNA);
    fs.writeFileSync(`./test_images/${user_wallet}_${randomDNA}_first.png`, firstFrameImage);
    fs.writeFileSync(`./test_images/${user_wallet}_${randomDNA}_profile.png`, profileImage);
    console.log("3---------------profile image-------------------")

    // fs.writeFileSync(`./test_images/${user_wallet}_${randomDNA}_nftImage.png`, nftImage);
    // fs.writeFileSync(`./test_images/${user_wallet}_${randomDNA}_profileImage.png`, profileImage);

    const { ipfsURL, profile_image } = await this.uploadNftDataToS3(
      spriteImage,
      nftImage,
      user_wallet,
      attributes,
      randomDNA,
      profileImage,
      firstFrameImage,
      totalPower,
      hashPath,
      nftType,
      totalRp
    );
    // const { ipfsURL, profile_image } = await this.uploadNftDataToS3(spriteImage, nftImage, user_wallet, attributes, randomDNA, profileImage, firstFrameImage, totalPower, hashPath, nftType, totalRp);
    // ipfsURL = await NFTStorageDao.storeNFT(base64ImgData, user_wallet, attributes);
    console.log("4---------------profile image-------------------", ipfsURL)
    return {
      // ipfsURL: "abhishek"
      ipfsURL
    }
  }

  static async uploadNftDataToS3(
    base64ImgData: Buffer,
    nftImage: Buffer,
    user_wallet: string,
    attributes: Array<{ trait_type: string; value: string }>,
    dna: string,
    profileImage: Buffer,
    firstFrameImage: Buffer,
    totalAp = 0,
    hashPath = "",
    nftType = "",
    totalRp = 0
  ) {
    const spriteUploadP = s3upload(
      base64ImgData,
      `bitfighter/${user_wallet}-${dna}-sprite.png`,
      "bitfighters",
      "image/png"
    );
    const nftUploadP = s3upload(
      nftImage,
      `bitfighter/${user_wallet}-${dna}-nft.png`,
      "bitfighters",
      "image/png"
    );
    const profileUploadP = s3upload(
      profileImage,
      `bitfighter/${user_wallet}-${dna}-profile.png`,
      "bitfighters",
      "image/png"
    );
    const firstFrameImageP = s3upload(
      firstFrameImage,
      `bitfighter/${user_wallet}-${dna}-first_frame.png`,
      "bitfighters",
      "image/png"
    );
    const [spriteUpload, nftUpload, profileUpload, firstFrameUpload] =
      await Promise.all([
        spriteUploadP,
        nftUploadP,
        profileUploadP,
        firstFrameImageP,
      ]);

    attributes.push({
      trait_type: "Rarity",
      value: nftType,
    });

    const data = {
      name: "₿it Fighter",
      description:
        "₿it Fighters is a real-time action, MMO social game, + ₿itcoin! Own buildings, operate 24/7 businesses, lead gangs, and dominate cities. The world is yours in this player focused, value driven, totally zany, one of a kind experience! See you in the HQ! https://BitFighters.club/",
      sprite_image: spriteUpload.Location,
      image: nftUpload.Location,
      profile_image: profileUpload.Location,
      first_frame_image: firstFrameUpload.Location,
      attributes,
      extra_info: hashPath,
      total_ap: totalAp,
      nft_type: nftType,
      total_rp: totalRp,
    };
    var base64data = Buffer.from(JSON.stringify(data));
    const res1 = await s3upload(
      base64data,
      `bitfighter/${user_wallet}-${dna}-${WEB_3_CONFIG.CONTRACT_ADDRESS}-metadata.json`,
      "bitfighters",
      "application/json"
    );
    return {
      ipfsURL: res1.Location,
      profile_image: profileUpload.Location,
    };
  }

  static createAttributes(randomDNA: string, attributesMap: IAttributes) {
    let attributes: Array<{ trait_type: string; value: string }> = [];
    // attributes.push({
    //   "trait_type": "dna",
    //   "value": randomDNA
    // });
    Object.keys(attributesMap).forEach(function (key) {
      var val: string = attributesMap[key];
      attributes.push({
        trait_type: key,
        value: val,
      });
    });
    return attributes;
  }

  static createAttributesV2(randomDNA: string, attributesMap: any) {
    let attributes: Array<{ trait_type: string; value: string }> = [];
    Object.keys(attributesMap).forEach(function (key) {
      var val: string = attributesMap[key];
      attributes.push({
        trait_type: key,
        value: val,
      });
    });
    return attributes;
  }

  static async createSpriteImageFromParts(
    randomDNA: string,
    userWalletAddress: string,
    parts_images_relation: object
  ) {
    let canvas = createCanvas(width, height);
    let ctx = canvas.getContext("2d");
    ctx.quality = "best";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let keys = Object.keys(parts_images_relation);
    for (let i = 0; i < keys.length; i++) {
      try {
        // console.log("layer -- ", parts_images_relation[keys[i]] ,randomDNA[i]);
        let imageFile = parts_images_relation[keys[i]][parseInt(randomDNA[i])];
        console.log("imageFile -- ", imageFile);
        let image = await loadImage(imageFile);
        ctx.drawImage(image, 0, 0);
      } catch (error) {
        console.log(error);
      }
    }
    return canvas;
  }

  static async createSpriteImageFromPartsV3(
    randomDNA: string,
    userWalletAddress: string,
    paths: string[]
  ) {
    let canvas = createCanvas(width, height);
    let ctx = canvas.getContext("2d");
    ctx.quality = "best";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // let keys = Object.keys(parts_images_relation);
    for (let i = 0; i < paths.length; i++) {
      try {
        // console.log("layer -- ", parts_images_relation[keys[i]] ,randomDNA[i]);
        let imageFile = paths[i];
        // console.log("imageFile -- ", imageFile);
        let image = await loadImage(imageFile);
        ctx.drawImage(image, 0, 0);
      } catch (error) {
        console.log("error in createSpriteImageFromPartsV3 ", paths[i], error)
        // console.log(error);
      }
    }
    return canvas;
  }

  static async createNFTImage(
    attributesMap: IAttributes,
    user_wallet: string,
    dna: string
  ) {
    var canvas = createCanvas(429, 779);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.quality = "nearest";
    ctx.patternQuality = "nearest";
    // Load background Image
    // var backgroundImage = await loadImage(NFT_ASSETS_PATH + "NFT_Card.png");
    // var newImage = await loadImage(`./${user_wallet}_${dna}_hero1.png`);
    // console.log(backgroundImage, newImage)
    ctx.font = "bold 20px cooper black";

    // Draw
    try {
      var backgroundImage = await loadImage(NFT_ASSETS_PATH + "NFT_Card_2.png");
      var newImage = await loadImage(`./${user_wallet}_${dna}_hero1.png`);
      ctx.drawImage(backgroundImage, 0, 0);
      ctx.drawImage(newImage, 0, 0, 64, 64, 80, 120, 280, 280);
      Object.keys(attributesMap).map((element, i) => {
        // if (i < Object.keys(attributesMap).length /2) {
        ctx.fillText(
          `${element} : ${attributesMap[element]}`,
          65,
          495 + i * 25
        );
        // }
        // else {
        //   ctx.fillText(`${element} : ${attributesMap[element]}`, 230, 420 + (i -5) * 30);
        // }
      });
      ctx.font = "bold 18px cooper black";
      ctx.fillText(`Total Power: 20`, 140, 440);
      ctx.font = "bold 18px cooper black";
      ctx.fillText(`Minted On: ${getMyDateFromDate()}`, 100, 720);
      ctx.font = "bold 16px cooper black";
      ctx.fillText(`www.bitFighters.club`, 130, 740);
    } catch (error) {
      console.log(error);
    }

    const base64ImgData = canvas.toBuffer("image/png");
    return base64ImgData;
  }

  static async createNFTImageV3(
    attributesMap: IAttributes,
    user_wallet: string,
    dna: string,
    nftType: string,
    partnerName: string
  ) {
    var canvas = createCanvas(428, 658);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.quality = "nearest";
    ctx.patternQuality = "nearest";
    // Load background Image
    // var backgroundImage = await loadImage(NFT_ASSETS_PATH + "NFT_Card.png");
    // var newImage = await loadImage(`./${user_wallet}_${dna}_hero1.png`);
    // console.log(backgroundImage, newImage)
    // ctx.font = 'bold 20px cooper black';
    ctx.font = '16px "Cooper black"';
    ctx.strokeStyle = "rgba(0,0,0,0.5)";

    // console.log("coming here ...")

    // Draw
    try {
      var backgroundImage = await loadImage(
        NFT_ASSETS_PATH + `new2/${nftType}.png`
      );
      var newImage = await loadImage(
        `./test_images/${user_wallet}_${dna}_hero1.png`
      );
      ctx.drawImage(backgroundImage, 0, 0);
      ctx.drawImage(newImage, 0, 0, 64, 64, 130, 245, 185, 185);

      ctx.font = '18px "Cooper black"';
      // ctx.strokeStyle = 'rgb(256, 256, 256)'
      ctx.fillStyle = "rgb(256, 256, 256)";
      Object.keys(attributesMap).map((element, i) => {
        // console.log("--- ", i, element, attributesMap[element])
        if (i < Object.keys(attributesMap).length / 2) {
          ctx.fillStyle = "rgb(256, 256, 256)";
          ctx.strokeStyle = "rgb(0,0,0)";
          ctx.font = '18px "Cooper black"';
          ctx.shadowColor = "black";
          ctx.lineWidth = 4;
          ctx.strokeText(
            `${element} : ${attributesMap[element]}`,
            90,
            522 + i * 30
          );
          ctx.fillText(
            `${element} : ${attributesMap[element]}`,
            90,
            522 + i * 30
          );
        } else {
          ctx.fillStyle = "rgb(256, 256, 256)";
          ctx.strokeStyle = "rgb(0,0,0)";
          ctx.font = '18px "Cooper black"';
          ctx.shadowColor = "black";
          ctx.lineWidth = 4;
          ctx.strokeText(
            `${element} : ${attributesMap[element]}`,
            260,
            522 + (i - 3) * 30
          );
          ctx.fillText(
            `${element} : ${attributesMap[element]}`,
            260,
            522 + (i - 3) * 30
          );
        }
      });
      ctx.font = 'bold 16px "Cooper black"';
      ctx.fillStyle = "rgb(256, 256, 256)";
      ctx.shadowColor = "black";
      ctx.lineWidth = 6;
      ctx.strokeText(`Level: 1`, 320, 35);
      ctx.strokeText(`Power: 20`, 320, 55);
      ctx.fillText(`Level: 1`, 320, 35);
      ctx.fillText(`Power: 20`, 320, 55);

      // partnerName = "Drip Fighter"

      ctx.font = 'bold 34px "Cooper black"';
      ctx.strokeText(partnerName, 130, 137);
      ctx.fillText(partnerName, 130, 137);

      ctx.font = 'bold 18px "Cooper black"';
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillText(`Minted: ${getMyDateFromDate()}`, 135, 622);
      ctx.fillText(`Only @ www.BitFighters.club`, 95, 640);
    } catch (error) {
      console.log(error);
    }

    const base64ImgData = canvas.toBuffer("image/png");
    return base64ImgData;
  }

  static async createNFTImageV4(
    attributesMap: any,
    user_wallet: string,
    dna: string,
    nftType: string,
    partnerName: string,
    totalPower: number
  ) {
    console.log("in --- createnftimagev4 ", attributesMap);
    var canvas = createCanvas(520, 800);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.quality = "nearest";
    ctx.patternQuality = "nearest";
    ctx.font = '16px "Cooper black"';
    ctx.strokeStyle = "rgba(0,0,0,0.5)";

    try {
      var newImage = await loadImage(
        `./test_images/${user_wallet}_${dna}_hero1.png`
      );
      var backgroundImage = await loadImage(
        NFT_ASSETS_PATH + `${NFT_FOLDER_NAME}/bg.png`
      );
      let randomBgOrFull = Math.random() >= 0.2 ? "bg" : "full";
      ctx.drawImage(backgroundImage, 0, 0);

      let res = fs.readdirSync(
        NFT_ASSETS_PATH + `${NFT_FOLDER_NAME}/${nftType}/bg/`
      );
      var randomBgIndex = Math.floor(Math.random() * res.length);
      var randomFullIndex = Math.floor(Math.random() * res.length);
      console.log(
        "bg or full ",
        randomBgOrFull,
        randomBgIndex,
        randomFullIndex,
        dna
      );

      var bgImage = await loadImage(
        NFT_ASSETS_PATH +
        `${NFT_FOLDER_NAME}/${nftType}/bg/${res[randomBgIndex]}`
      );
      var FullImage = await loadImage(
        NFT_ASSETS_PATH +
        `${NFT_FOLDER_NAME}/${nftType}/full/${res[randomFullIndex]}`
      );

      var TopImage = await loadImage(
        NFT_ASSETS_PATH + `${NFT_FOLDER_NAME}/top.png`
      );
      if (randomBgOrFull === "bg") {
        ctx.drawImage(bgImage, 0, 0);
      } else {
        ctx.drawImage(FullImage, 0, 0);
        ctx.drawImage(bgImage, 0, 0);
      }

      // ctx.drawImage(newImage, 0, 0, 64, 64, 130, 245, 185, 185 )
      ctx.drawImage(TopImage, 0, 0);
      var origShadowColor = ctx.shadowColor;

      ctx.shadowColor = "rgba(17, 17, 17, 0.7)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 20;
      ctx.shadowOffsetY = 10;
      ctx.drawImage(newImage, 0, 0, 64, 64, 70, 140, 400, 400);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.font = '18px "Cooper black"';
      ctx.fillStyle = "rgb(256, 256, 256)";
      // for(let i=0; i < 6; i++) {
      //   const element = attributesMap[i];
      //   if (i < 3) {
      //     ctx.fillStyle = 'rgb(256, 256, 256)'
      //     ctx.strokeStyle = 'rgb(0,0,0)'
      //     ctx.font = '22px "Cooper black"'
      //     ctx.shadowColor = "black"
      //     ctx.lineWidth=4;
      //     ctx.strokeText(`${element} : ${attributesMap[element]}`, 70, 625 + i * 36)
      //     ctx.fillText(`${element} : ${attributesMap[element]}`, 70, 625 + i * 36);
      //   }
      //   else {
      //     ctx.fillStyle = 'rgb(256, 256, 256)'
      //     ctx.strokeStyle = 'rgb(0,0,0)'
      //     ctx.font = '22px "Cooper black"'
      //     ctx.shadowColor = "black"
      //     ctx.lineWidth=4;
      //     ctx.strokeText(`${element} : ${attributesMap[element]}`, 300, 625 + (i -3) * 36);
      //     ctx.fillText(`${element} : ${attributesMap[element]}`, 300, 625 + (i -3) * 36);
      //   }
      // }

      Object.keys(attributesMap).map((element, i) => {
        ctx.fillStyle = "rgb(256, 256, 256)";
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.font = '62px "Cooper black"';
        ctx.shadowColor = "black";
        ctx.lineWidth = 4;
        if (i < Object.keys(attributesMap).length / 2) {
          ctx.strokeText(`${attributesMap[element]}`, 105, 642 + i * 60);
          ctx.fillText(`${attributesMap[element]}`, 105, 642 + i * 60);
        } else {
          ctx.strokeText(`${attributesMap[element]}`, 260, 642 + (i - 3) * 60);
          ctx.fillText(`${attributesMap[element]}`, 260, 642 + (i - 3) * 60);
        }
        // if (i < Object.keys(attributesMap).length /2) {
        //   ctx.strokeText(`99`, 105, 636 + i * 60)
        //   ctx.fillText(`99`, 105, 636 + i * 60);
        // }
        // else {
        //   ctx.strokeText(`99`, 260, 636 + (i -3) * 60);
        //   ctx.fillText(`99`, 260, 636 + (i -3) * 60);
        // }
      });
      ctx.font = 'bold 24px "Cooper black"';
      ctx.fillStyle = "rgb(256, 256, 256)";
      ctx.shadowColor = "black";
      ctx.lineWidth = 6;

      ctx.strokeText(`Level: 1`, 40, 550);
      ctx.fillText(`Level: 1`, 40, 550);

      ctx.strokeText(`Power: ${totalPower}`, 40, 570);
      ctx.fillText(`Power: ${totalPower}`, 40, 570);

      ctx.font = 'bold 28px "Cooper black"';
      ctx.fillStyle = "rgb(256, 256, 256)";
      ctx.shadowColor = "black";
      ctx.lineWidth = 6;

      ctx.strokeText(`Gen. Zero`, 350, 570);
      ctx.fillText(`Gen. Zero`, 350, 570);

      // ctx.font = 'bold 34px "Cooper black"';
      // ctx.strokeText(partnerName, 130, 137);
      // ctx.fillText(partnerName, 130, 137);

      // ctx.font = 'bold 22px "Cooper black"';
      // ctx.fillStyle = 'rgb(0,0,0)';
      // ctx.fillText(`Minted: ${getMyDateFromDate()}`, 135, 750);
      // ctx.fillText(`Only @ www.BitFighters.club`, 95, 775);
    } catch (error) {
      console.log(error);
    }

    const base64ImgData = canvas.toBuffer("image/png");
    return base64ImgData;
  }

  static async createProfileImage(
    attributesMap: any,
    user_wallet: string,
    dna: string
  ) {
    var canvas = createCanvas(200, 200);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.quality = "nearest";
    ctx.patternQuality = "nearest";
    // Draw
    try {
      var newImage = await loadImage(
        `./test_images/${user_wallet}_${dna}_hero1.png`
      );
      ctx.drawImage(newImage, 10, 0, 50, 35, 0, 0, 200, 200);
    } catch (error) {
      console.log(error);
    }

    const base64ImgData = canvas.toBuffer("image/png");
    return base64ImgData;
  }

  static async createFirstFrameImage(
    attributesMap: any,
    user_wallet: string,
    dna: string
  ) {
    var canvas = createCanvas(64, 64);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.quality = "nearest";
    ctx.patternQuality = "nearest";
    // Draw
    try {
      var newImage = await loadImage(
        `./test_images/${user_wallet}_${dna}_hero1.png`
      );
      ctx.drawImage(newImage, 0, 0, 64, 64, 0, 0, 64, 64);
    } catch (error) {
      console.log(error);
    }

    const base64ImgData = canvas.toBuffer("image/png");
    return base64ImgData;
  }

  // static createRandomDNA() {
  //   let randomDNA = ''
  //   let parts_images_relation = {}
  //   // console.log(process.cwd())

  //   // randomly select shoes or feet.
  //   let shoes = false
  //   if (Math.random() > 0.5) {
  //     shoes = true
  //   }
  //   let body_layer_shirt_selected = false;
  //   let selected_shoes = "";
  //   try {
  //     // console.log(fs.readdirSync('./src/assets/'))
  //     // console.log(fs.readdirSync('./src/assets/input/'))
  //     let counts = []
  //     // read the input repository and the folders within them ..
  //     for (let i = 0 ; i< LayerWiseBodyParts.length; i++) {
  //       if (shoes && i == 1) {
  //         continue
  //       }
  //       if (!shoes && i == 3) {
  //         continue
  //       }
  //       let res = fs.readdirSync(`${BASE_ASSETS_PATH}${LayerWiseBodyParts[i]}/`)
  //       let paths: Array<string> = []
  //       for (let j = 0; j< res.length; j++) {
  //         // if (!res[j].includes("DS_Store")) {
  //         paths.push(`${BASE_ASSETS_PATH}${LayerWiseBodyParts[i]}/${res[j]}`)
  //         // }
  //       }
  //       let randomIndex = Math.floor(Math.random() * paths.length);
  //       if (i === 16 ) {
  //         if (shoes && selected_shoes.includes("runners")) {
  //           randomIndex = 1;
  //         } else if (shoes && selected_shoes.includes("shoes")) {
  //           randomIndex = 2;
  //         } else {
  //           randomIndex = 0;
  //         }
  //       }
  //       let selectedLayerName: string = paths[randomIndex];
  //       if (i == 3 ) {
  //         let temp = selectedLayerName.split("/");
  //         selected_shoes = temp[temp.length- 1].split(".")[0];
  //       }

  //       if (i === 6 && selectedLayerName.includes("shirt")) {
  //         body_layer_shirt_selected = true
  //       }
  //       console.log("-- ", shoes, selectedLayerName, selectedLayerName.includes("shirt"), i , body_layer_shirt_selected)
  //       if (!body_layer_shirt_selected && i === 15) {
  //         continue;
  //       }

  //       randomDNA += randomIndex.toString();
  //       parts_images_relation[LayerWiseBodyParts[i]] = paths;
  //       counts.push(res.length)
  //     }

  //   } catch(e) {
  //     console.log("error in createRandomDNA", e)
  //   }
  //   return {
  //     randomDNA,
  //     parts_images_relation
  //   };
  // }

  // static rollCUR(max = 11, min = 1) {
  //   let val = Math.floor(Math.random() * (max - min) + min);
  //   // console.log("in rollcur ", val)
  //   if (val > 4) {
  //     return "common"
  //   }
  //   if (val > 1) {
  //     return "uncommon"
  //   }
  //   if (val === 1) {
  //     return "rare"
  //   }
  // }

  // static rollCUR(max = 9, min = 1) {
  //   let val = Math.floor(Math.random() * (max - min) + min);
  //   if (val >= 6) {
  //     return "rare"
  //   }
  //   else if (val >= 3 && val <6) {
  //     return "uncommon"
  //   }
  //   else if (val >= 0) {
  //     return "common"
  //   }
  // }

  static rollCUR(max = 10, min = 1) {
    let val = Math.random();
    if (val <= 0.6) {
      return "common";
    } else if (val <= 0.9 && val > 0.6) {
      return "uncommon";
    } else {
      return "rare";
    }
  }

  static calculateOnBasisOfCUR(val: string) {
    if (val === "common") {
      return 1;
    }
    if (val === "uncommon") {
      return 5;
    }
    if (val === "rare") {
      return 10;
    }
  }

  static createRandomDnaV3(isDrip = false) {
    let randomDNA = "";
    let totalRp = 0;
    let parts_images_relation = {};

    // now i need to decide which body part to give

    // // fixed asset.. where there is no choosing among cur.
    // const fixed_asset_indices = [0, 4, ]

    // track feet
    let feet_lower_iamge_selected = "";
    let feet_lower_index_selected = -1;

    let arms_low_selected = "";
    let arms_lower_index_selected = -1;

    let body_low_selected = "";
    let body_and_body_top = false;
    let body_lower_index_selected = -1;

    let paths: Array<string> = [];

    let skipBodyTopAndBodyArmsTop = false;
    let gotPonchoInBodyTop = false;
    let gotNinjaBody = false;
    let body_top_part_selected = "";
    let gotLabcoat = false;
    let gotSuit = false;
    let suitName = "";
    let samples = [];
    try {
      for (let i = 0; i < LayerWiseBodyPartsV3.length; i++) {
        // let partName = LayerWiseBodyPartsV3[i].replace(/[0-9]/g, '')
        // console.log("--", i, "--", LayerWiseBodyPartsV3[i])

        let res = fs.readdirSync(
          `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/`
        );
        if (
          //   i === 0 // wings
          // ||
          i === 4 || // neck
          i === 13 // items
        ) {
          randomDNA += "0";
          paths.push(`${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${res[0]}`);
        }

        if (
          i === 0 // wings
        ) {
          let randomInCUR = Math.floor(Math.random() * res.length);
          randomDNA += randomInCUR.toString();
          paths.push(`${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${res[1]}`);
          // paths.push(`${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${res[randomInCUR]}`)
        }

        // drip tattoo
        if (i === 16) {
          if (isDrip) {
            randomDNA += "d1";
            paths.push(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${res[0]}`
            );
          } else {
            randomDNA += "d0";
          }
        }

        if (
          i === 1 || // legs
          i == 2 || // feet
          i == 3 || // arms_low
          i === 5 || // body
          i === 8 || // heads
          i === 9 || // eyes
          i === 10 || // hat_hair
          i === 14 // hands
        ) {
          // roll cur
          let val = GeneratorDao.rollCUR();
          samples.push(val);
          // console.log("--------check--------", val)
          totalRp += GeneratorDao.calculateOnBasisOfCUR(val);
          let res = fs.readdirSync(
            `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${val}/`
          );
          let randomInCUR = Math.floor(Math.random() * res.length);

          // console.log("when i === ", i,  val , randomInCUR, `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${val}/${res[randomInCUR]}`)

          if (i === 2) {
            feet_lower_iamge_selected = res[randomInCUR];
            feet_lower_index_selected = randomInCUR;
          }
          if (i === 3) {
            arms_low_selected = val + "/" + res[randomInCUR];
            arms_lower_index_selected = randomInCUR;

            if (
              arms_low_selected.includes("Diamond") ||
              arms_low_selected.includes("Gold") ||
              arms_low_selected.includes("Ruby") ||
              arms_low_selected.includes("Emerald")
            ) {
              skipBodyTopAndBodyArmsTop = true;
            }
          }
          if (i === 5) {
            body_low_selected = val + "/" + res[randomInCUR];
            body_lower_index_selected = randomInCUR;
            if (body_low_selected.includes("Poncho")) {
              console.log("------------ going here .. ", body_low_selected);
              gotPonchoInBodyTop = true;
              // paths[0].replace("wings", "poncho")
              paths.splice(0, 1, "./src/assets/input46/1 wings/Poncho.png");
            }
            if (body_low_selected.includes("Ninja")) {
              gotNinjaBody = true;
            }
            if (body_low_selected.includes("Lab Coat")) {
              gotLabcoat = true;
              console.log("--- gotlabcoat", gotLabcoat);
            }
            if (body_low_selected.includes("Suit")) {
              gotSuit = true;
              suitName = res[randomInCUR];
              console.log("--- gotSuit", gotSuit);
            }
          }

          if (i === 9) {
            // if scouter

            if (res[randomInCUR] === "Scouter.png") {
              let val = GeneratorDao.rollCUR();
              res = fs.readdirSync(
                `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${val}/`
              );
              let randomInCUR = Math.floor(Math.random() * res.length);
              console.log("---debug---", val, res[randomInCUR]);

              while (res[randomInCUR] === "Scouter.png") {
                val = GeneratorDao.rollCUR();
                res = fs.readdirSync(
                  `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${val}/`
                );
                randomInCUR = Math.floor(Math.random() * res.length);
                console.log("---debug 2--- ", val, res[randomInCUR]);
              }

              paths.push(
                `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${val}/${res[randomInCUR]}`
              );
              paths.push(
                `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/rare/Scouter.png`
              );
              randomDNA += randomInCUR.toString();
            } else {
              paths.push(
                `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${val}/${res[randomInCUR]}`
              );
              randomDNA += randomInCUR.toString();
            }
          }

          if (i === 9) {
            continue;
          }
          paths.push(
            `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${val}/${res[randomInCUR]}`
          );
          randomDNA += randomInCUR.toString();
        }

        // 6 - arms
        if (
          i === 6 || // arms
          i === 11 // arms top
        ) {
          console.log("in i == 6 and i == 11 ", arms_low_selected);
          if (
            fs.existsSync(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${arms_low_selected}`
            )
          ) {
            paths.push(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${arms_low_selected}`
            );
            randomDNA += arms_lower_index_selected.toString();
          }
        }

        // 13 - body top
        if (
          i === 7 || // body top
          i === 12 // body arms top
        ) {
          console.log(
            "**** ",
            skipBodyTopAndBodyArmsTop,
            gotPonchoInBodyTop,
            gotLabcoat
          );
          if (i === 7 && (gotLabcoat || gotSuit)) {
            continue;
          }

          if (
            i === 12 &&
            (body_and_body_top || gotLabcoat || gotSuit) &&
            fs.existsSync(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${body_top_part_selected}`
            )
          ) {
            if (gotLabcoat) {
              paths.push(
                `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/Lab Coat.png`
              );
            } else if (gotSuit) {
              paths.push(
                `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${suitName}`
              );
            } else {
              paths.push(
                `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${body_top_part_selected}`
              );
            }
            randomDNA += body_lower_index_selected.toString();
          }

          if (skipBodyTopAndBodyArmsTop) {
            continue;
          }

          if (i === 7) {
            // choose same as original body base
            console.log(
              "going in loop i = 7 i.e. body_top ",
              body_low_selected,
              gotPonchoInBodyTop,
              gotNinjaBody
            );
            // if (fs.existsSync(`${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${body_low_selected}`)) {
            if (Math.random() > 0.7 || gotPonchoInBodyTop || gotNinjaBody) {
              randomDNA += body_lower_index_selected.toString();

              if (body_low_selected.includes("Blue Chirp")) {
                body_top_part_selected = `Blue Chirp.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Blue")) {
                body_top_part_selected = `Blue.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Black Ninja")) {
                // body_top_part_selected = `Black Ninja.png`
                // body_and_body_top = true;
                continue;
              } else if (body_low_selected.includes("White Ninja")) {
                continue;
                // body_top_part_selected = `White Ninja.png`
                // body_and_body_top = true;
              } else if (body_low_selected.includes("Red")) {
                body_top_part_selected = `Red.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Black")) {
                body_top_part_selected = `Black.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Brown Camo")) {
                body_top_part_selected = `Brown Camo.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Green Camo")) {
                body_top_part_selected = `Green Camo.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Poncho")) {
                body_top_part_selected = `Poncho.png`;
                body_and_body_top = true;
              }

              if (body_and_body_top) {
                paths.push(
                  `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${body_top_part_selected}`
                );
              }
            }
          }
        }

        // 15 - feet top
        if (i === 15) {
          // choose same as feet base
          if (
            feet_lower_iamge_selected.includes("Jordies") ||
            feet_lower_iamge_selected.includes("Timbies")
          ) {
            paths.push(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/Boot.png`
            );
            randomDNA += feet_lower_index_selected.toString();
          } else if (
            feet_lower_iamge_selected.includes("Black Shoes") ||
            feet_lower_iamge_selected.includes("Brown Shoes")
          ) {
            paths.push(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/Boot.png`
            );
            randomDNA += feet_lower_index_selected.toString();
          } else if (feet_lower_iamge_selected.includes("Shoes")) {
            paths.push(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/Shoes.png`
            );
            randomDNA += feet_lower_index_selected.toString();
          } else if (
            feet_lower_iamge_selected.includes("Slipper") ||
            feet_lower_iamge_selected.includes("Socks")
          ) {
            paths.push(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/SlipperSocks.png`
            );
            randomDNA += feet_lower_index_selected.toString();
          } else {
            paths.push(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${feet_lower_iamge_selected}`
            );
            randomDNA += feet_lower_index_selected.toString();
          }
        }

        // 16 - fx
        if (i === 17) {
          res = fs.readdirSync(
            `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/`
          );
          for (let j = 0; j < res.length; j++) {
            paths.push(
              `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${res[j]}`
            );
            randomDNA += j.toString();
          }
        }

        // 17 - hits
        if (i === 18) {
          res = fs.readdirSync(
            `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/`
          );
          let randomInCUR = Math.floor(Math.random() * res.length);
          paths.push(
            `${BASE_ASSETS_PATH}${LayerWiseBodyPartsV3[i]}/${res[randomInCUR]}`
          );
          randomDNA += randomInCUR.toString();
        }
      }
    } catch (e) {
      console.log("error in createRandomDNA", e);
    }

    let labcoat_exist = false;
    let moonBoy = false;
    let suitExist = false;
    var re = new RegExp("6.+body.+Suit");
    for (let i = 0; i < paths.length; i++) {
      if (paths[i].includes("rare/Lab Coat.png")) {
        labcoat_exist = true;
      }
      if (paths[i].includes("Moon Boy")) {
        moonBoy = true;
      }
      let found = paths[i].match(re);
      if (found) {
        console.log("******match******", paths[i]);
        suitExist = true;
      }
    }

    for (let i = 0; i < paths.length; i++) {
      if (labcoat_exist) {
        if (paths[i].includes("arms")) {
          paths.splice(i, 1);
        }
        if (paths[i] === "./src/assets/input46/13 Body Arms Top/") {
          paths[i] = "./src/assets/input46/13 Body Arms Top/Lab Coat.png";
        }
      }
      if (moonBoy) {
        if (paths[i].includes("hat_hair")) {
          paths.splice(i, 1);
        }
      }
      if (suitExist) {
        if (paths[i].includes("arms")) {
          paths.splice(i, 1);
        }
      }
    }

    // console.log("--------------", arms_low_selected)
    // console.log("--------------", feet_lower_iamge_selected)
    // console.log("--------------", body_low_selected)
    console.log("-----totalRP ", totalRp, labcoat_exist, randomDNA);
    // console.log("--------check--------", samples)
    return {
      randomDNA,
      parts_images_relation,
      paths,
      totalRp,
    };
  }

  static createPartnerDNA(partner_name = 'cutie') {

    let base_assets_path = ''
    if (partner_name === 'cutie') {
      base_assets_path = BASE_ASSETS_PATH_CUTIE_BOTS
    }
    if (base_assets_path == '') {
      return
    }
    let randomDNA = "";
    let totalRp = 0;
    let parts_images_relation = {};

    // track feet
    let feet_lower_iamge_selected = "";
    let feet_lower_index_selected = -1;

    let arms_low_selected = "";
    let arms_lower_index_selected = -1;

    let body_low_selected = "";
    let body_and_body_top = false;
    let body_lower_index_selected = -1;

    let paths: Array<string> = [];

    let skipBodyTopAndBodyArmsTop = false;
    let gotPonchoInBodyTop = false;
    let gotNinjaBody = false;
    let body_top_part_selected = "";
    let gotLabcoat = false;
    let gotSuit = false;
    let suitName = "";
    let samples = [];
    try {
      for (let i = 0; i < LayerWiseBodyPartsV3.length; i++) {
        let res = fs.readdirSync(
          `${base_assets_path}${LayerWiseBodyPartsV3[i]}/`
        );
        if (
          i === 4 || // neck
          i === 13 // items
        ) {
          randomDNA += "0";
          paths.push(`${base_assets_path}${LayerWiseBodyPartsV3[i]}/${res[0]}`);
        }

        if (
          i === 0 // wings
        ) {
          let randomInCUR = Math.floor(Math.random() * res.length);
          randomDNA += randomInCUR.toString();
          paths.push(`${base_assets_path}${LayerWiseBodyPartsV3[i]}/${res[1]}`);
          // paths.push(`${base_assets_path}${LayerWiseBodyPartsV3[i]}/${res[randomInCUR]}`)
        }

        if (
          // i === 8 || // heads
          i === 9 || // eyes
          i === 10 // hat_hair
        ) {
          let random_chance = Math.random() > 0.5;
          let val = GeneratorDao.rollCUR();
          totalRp += GeneratorDao.calculateOnBasisOfCUR(val);
          if (random_chance) {
            paths.push(`${base_assets_path}${LayerWiseBodyPartsV3[i]}/${res[0]}`);
          }
        }

        if (
          i === 8  // heads
        ) {
          let val = GeneratorDao.rollCUR();
          totalRp += GeneratorDao.calculateOnBasisOfCUR(val);
          paths.push(`${base_assets_path}${LayerWiseBodyPartsV3[i]}/${res[0]}`);
        }


        if (
          i === 1 || // legs
          i == 2 || // feet
          i == 3 || // arms_low
          i === 5 || // body
          // i === 8 || // heads
          // i === 9 || // eyes
          // i === 10 || // hat_hair
          i === 14 // hands
        ) {
          // roll cur
          let val = GeneratorDao.rollCUR();
          samples.push(val);
          // console.log("--------check--------", val)
          totalRp += GeneratorDao.calculateOnBasisOfCUR(val);
          let res = fs.readdirSync(
            `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${val}/`
          );
          let randomInCUR = Math.floor(Math.random() * res.length);


          if (i === 2) {
            feet_lower_iamge_selected = res[randomInCUR];
            feet_lower_index_selected = randomInCUR;
          }
          if (i === 3) {
            arms_low_selected = val + "/" + res[randomInCUR];
            arms_lower_index_selected = randomInCUR;

            if (
              arms_low_selected.includes("Diamond") ||
              arms_low_selected.includes("Gold") ||
              arms_low_selected.includes("Ruby") ||
              arms_low_selected.includes("Emerald")
            ) {
              skipBodyTopAndBodyArmsTop = true;
            }
          }
          if (i === 5) {
            body_low_selected = val + "/" + res[randomInCUR];
            body_lower_index_selected = randomInCUR;
            if (body_low_selected.includes("Poncho")) {
              console.log("------------ going here .. ", body_low_selected);
              gotPonchoInBodyTop = true;
              // paths[0].replace("wings", "poncho")
              paths.splice(0, 1, `${base_assets_path}/1 wings/Poncho.png`);
            }
            if (body_low_selected.includes("Ninja")) {
              gotNinjaBody = true;
            }
            if (body_low_selected.includes("Lab Coat")) {
              gotLabcoat = true;
              console.log("--- gotlabcoat", gotLabcoat);
            }
            if (body_low_selected.includes("Suit")) {
              gotSuit = true;
              suitName = res[randomInCUR];
              console.log("--- gotSuit", gotSuit);
            }
          }

          paths.push(
            `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${val}/${res[randomInCUR]}`
          );
          randomDNA += randomInCUR.toString();
        }

        // 6 - arms
        if (
          i === 6 || // arms
          i === 11 // arms top
        ) {
          console.log("in i == 6 and i == 11 ", arms_low_selected);
          if (
            fs.existsSync(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${arms_low_selected}`
            )
          ) {
            paths.push(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${arms_low_selected}`
            );
            randomDNA += arms_lower_index_selected.toString();
          }
        }

        // 13 - body top
        if (
          i === 7 || // body top
          i === 12 // body arms top
        ) {
          console.log(
            "**** ",
            skipBodyTopAndBodyArmsTop,
            gotPonchoInBodyTop,
            gotLabcoat
          );
          if (i === 7 && (gotLabcoat || gotSuit)) {
            continue;
          }

          if (
            i === 12 &&
            (body_and_body_top || gotLabcoat || gotSuit) &&
            fs.existsSync(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${body_top_part_selected}`
            )
          ) {
            if (gotLabcoat) {
              paths.push(
                `${base_assets_path}${LayerWiseBodyPartsV3[i]}/Lab Coat.png`
              );
            } else if (gotSuit) {
              paths.push(
                `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${suitName}`
              );
            } else {
              paths.push(
                `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${body_top_part_selected}`
              );
            }
            randomDNA += body_lower_index_selected.toString();
          }

          if (skipBodyTopAndBodyArmsTop) {
            continue;
          }

          if (i === 7) {
            // choose same as original body base
            console.log(
              "going in loop i = 7 i.e. body_top ",
              body_low_selected,
              gotPonchoInBodyTop,
              gotNinjaBody
            );
            // if (fs.existsSync(`${base_assets_path}${LayerWiseBodyPartsV3[i]}/${body_low_selected}`)) {
            if (Math.random() > 0.7 || gotPonchoInBodyTop || gotNinjaBody) {
              randomDNA += body_lower_index_selected.toString();

              if (body_low_selected.includes("Blue Chirp")) {
                body_top_part_selected = `Blue Chirp.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Blue")) {
                body_top_part_selected = `Blue.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Black Ninja")) {
                // body_top_part_selected = `Black Ninja.png`
                // body_and_body_top = true;
                continue;
              } else if (body_low_selected.includes("White Ninja")) {
                continue;
                // body_top_part_selected = `White Ninja.png`
                // body_and_body_top = true;
              } else if (body_low_selected.includes("Red")) {
                body_top_part_selected = `Red.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Black")) {
                body_top_part_selected = `Black.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Brown Camo")) {
                body_top_part_selected = `Brown Camo.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Green Camo")) {
                body_top_part_selected = `Green Camo.png`;
                body_and_body_top = true;
              } else if (body_low_selected.includes("Poncho")) {
                body_top_part_selected = `Poncho.png`;
                body_and_body_top = true;
              }

              if (body_and_body_top) {
                paths.push(
                  `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${body_top_part_selected}`
                );
              }
            }
          }
        }

        // 15 - feet top
        if (i === 15) {
          // choose same as feet base
          if (
            feet_lower_iamge_selected.includes("Jordies") ||
            feet_lower_iamge_selected.includes("Timbies")
          ) {
            paths.push(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/Boot.png`
            );
            randomDNA += feet_lower_index_selected.toString();
          } else if (
            feet_lower_iamge_selected.includes("Black Shoes") ||
            feet_lower_iamge_selected.includes("Brown Shoes")
          ) {
            paths.push(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/Boot.png`
            );
            randomDNA += feet_lower_index_selected.toString();
          } else if (feet_lower_iamge_selected.includes("Shoes")) {
            paths.push(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/Shoes.png`
            );
            randomDNA += feet_lower_index_selected.toString();
          } else if (
            feet_lower_iamge_selected.includes("Slipper") ||
            feet_lower_iamge_selected.includes("Socks")
          ) {
            paths.push(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/SlipperSocks.png`
            );
            randomDNA += feet_lower_index_selected.toString();
          } else {
            paths.push(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${feet_lower_iamge_selected}`
            );
            randomDNA += feet_lower_index_selected.toString();
          }
        }

        // 16 - fx
        if (i === 17) {
          res = fs.readdirSync(
            `${base_assets_path}${LayerWiseBodyPartsV3[i]}/`
          );
          for (let j = 0; j < res.length; j++) {
            paths.push(
              `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${res[j]}`
            );
            randomDNA += j.toString();
          }
        }

        // 17 - hits
        if (i === 18) {
          res = fs.readdirSync(
            `${base_assets_path}${LayerWiseBodyPartsV3[i]}/`
          );
          let randomInCUR = Math.floor(Math.random() * res.length);
          paths.push(
            `${base_assets_path}${LayerWiseBodyPartsV3[i]}/${res[randomInCUR]}`
          );
          randomDNA += randomInCUR.toString();
        }
      }
    } catch (e) {
      console.log("error in createRandomDNA", e);
    }

    let labcoat_exist = false;
    let moonBoy = false;
    let suitExist = false;
    var re = new RegExp("6.+body.+Suit");
    for (let i = 0; i < paths.length; i++) {
      if (paths[i].includes("rare/Lab Coat.png")) {
        labcoat_exist = true;
      }
      if (paths[i].includes("Moon Boy")) {
        moonBoy = true;
      }
      let found = paths[i].match(re);
      if (found) {
        console.log("******match******", paths[i]);
        suitExist = true;
      }
    }

    for (let i = 0; i < paths.length; i++) {
      if (labcoat_exist) {
        if (paths[i].includes("arms")) {
          paths.splice(i, 1);
        }
        if (paths[i] === `${base_assets_path}/13 Body Arms Top/`) {
          paths[i] = "${base_assets_path}/13 Body Arms Top/Lab Coat.png";
        }
      }
      if (moonBoy) {
        if (paths[i].includes("hat_hair")) {
          paths.splice(i, 1);
        }
      }
      if (suitExist) {
        if (paths[i].includes("arms")) {
          paths.splice(i, 1);
        }
      }
    }

    console.log("-----totalRP ", totalRp, labcoat_exist, randomDNA);
    return {
      randomDNA,
      parts_images_relation,
      paths,
      totalRp,
    };
  }

  static async TransferAndDeleteBitfighter(
    userWalletAddress: string,
    nick_name: string,
    newUserWalletAddress: string
  ) {
    const bitFighter = await BITFIGHTER_NFT_SPECS.fetchNFTsOfUserAddress(
      userWalletAddress
    );
    if (isNullOrUndefined(bitFighter)) {
      throw "Error happened";
    }
    try {
      const fighter = bitFighter[0];
      fighter.user_wallet_address = newUserWalletAddress;
      fighter.nick_name = nick_name;
      await mapper.put(fighter);
    } catch (err) {
      ANAKIN_LOGGER.error({ event: "TransferAndDeleteBitfighter", error: err });
    }
  }

  static async GeneratePreSaleNFT(user_wallet_address: string) {
    // const data = {
    //   name: 'Bit Fighter Mint Card',
    //   description: 'You may redeem this Mint Card for 1 Bit Fighter!',
    //   image: "https://production-bitfighters.s3.ap-south-1.amazonaws.com/videos/NFT_img.png",
    //   media:{
    //     uri:"https://production-bitfighters.s3.ap-south-1.amazonaws.com/videos/mc.mp4",
    //     dimensions:"1280x720",
    //     mimeType:"video/mp4"
    //   },
    //   dna: uuidv4(),
    // }
    // let base64data = Buffer.from(JSON.stringify(data));
    // const res1 = await s3upload(base64data, `${user_wallet_address}-${uuidv4()}-metadata.json`, 'bitfighters', 'application/json')
    // return {
    //   nft_url: res1.Location,
    // };
  }

  static async GeneratePreSaleNFTV2(user_wallet_address: string) {
    const data = {
      name: "Bit Fighter Mint Card",
      description: "You may redeem this Mint Card for 1 Bit Fighter!",
      image:
        "https://production-bitfighters.s3.ap-south-1.amazonaws.com/presaleData/PresaleMintCardNft.png",
      media: {
        uri: "https://production-bitfighters.s3.ap-south-1.amazonaws.com/presaleData/PresaleMintCard.mp4",
        dimensions: "1280x720",
        mimeType: "video/mp4",
      },
      dna: uuidv4(),
      attributes: [
        {
          trait_type: "Generation",
          value: "Zero",
        },
        {
          trait_type: "Series",
          value: "Base",
        },
        {
          trait_type: "Version",
          value: "Two",
        },
        {
          trait_type: "Type",
          value: "N/A",
        },
      ],
    };
    let base64data = Buffer.from(JSON.stringify(data));
    const res1 = await s3upload(
      base64data,
      `presale/${user_wallet_address}-${uuidv4()}-metadata.json`,
      "bitfighters",
      "application/json"
    );
    return res1.Location;
  }

  static async GeneratePreSaleNFTV2Admin(user_wallet_address: string) {
    console.log("in GeneratePreSaleNFTV2Admin ... ", user_wallet_address);
    if (user_wallet_address === "" || isNullOrUndefined(user_wallet_address)) {
      throw "EMPTY_USER_WALLET";
    }
    const data = {
      name: "Bit Fighter Mint Card",
      description: "You may redeem this Mint Card for 1 Bit Fighter!",
      image:
        "https://production-bitfighters.s3.ap-south-1.amazonaws.com/presaleData/PresaleMintCardNft.png",
      media: {
        uri: "https://production-bitfighters.s3.ap-south-1.amazonaws.com/presaleData/PresaleMintCard.mp4",
        dimensions: "1280x720",
        mimeType: "video/mp4",
      },
      dna: uuidv4(),
      attributes: [
        {
          trait_type: "Generation",
          value: "Zero",
        },
        {
          trait_type: "Series",
          value: "Base",
        },
        {
          trait_type: "Version",
          value: "Two",
        },
        // {
        //   "trait_type": "Type",
        //   "value": "OG"
        // },
      ],
    };
    let base64data = Buffer.from(JSON.stringify(data));
    const res1 = await s3upload(
      base64data,
      `presale/${user_wallet_address}-${uuidv4()}-metadata.json`,
      "bitfighters",
      "application/json"
    );
    return res1.Location;
  }

  static async GeneratePreSaleDripNFTV2(
    user_wallet_address: string,
    tatoo: string,
    tag: string
  ) {
    const data = {
      name: "Drip Fighter Mint Card",
      description: "You may redeem this Mint Card for 1 Bit Fighter!",
      image:
        "https://production-bitfighters.s3.ap-south-1.amazonaws.com/presaleData/Drip_Card_img.png",
      media: {
        uri: "https://production-bitfighters.s3.ap-south-1.amazonaws.com/presaleData/Drip_Fighter_Pre_Sale_Mint_Card.mp4",
        dimensions: "1280x720",
        mimeType: "video/mp4",
      },
      dna: uuidv4(),
      attributes: [
        {
          trait_type: "tattoo",
          value: tatoo,
        },
        {
          trait_type: "tag",
          value: tag,
        },
        {
          trait_type: "Generation",
          value: "Zero",
        },
        {
          trait_type: "Series",
          value: "Partner",
        },
        {
          trait_type: "Version",
          value: "One",
        },
        {
          trait_type: "Type",
          value: "N/A",
        },
      ],
    };
    let base64data = Buffer.from(JSON.stringify(data));
    const res1 = await s3upload(
      base64data,
      `drip_presale/${user_wallet_address}-${uuidv4()}-metadata.json`,
      "bitfighters",
      "application/json"
    );
    return res1.Location;
  }

  static async GenerateOneK(user_wallet_address: string, _id: number) {
    let file_key = "";
    if (_id < 10) {
      file_key = `000${_id}`;
    } else if (_id >= 10 && _id < 100) {
      file_key = `00${_id}`;
    } else if (_id >= 100 && _id < 1000) {
      file_key = `0${_id}`;
    } else if (_id === 1000) {
      file_key = `${_id}`;
    }
    const data = {
      name: `1K Club Card`,
      description:
        "The 1k Club is the premier membership within Bit Fighters. Holders of these cards will benefit from numerous perks. See our documentation to learn more!",
      image: `https://new-prod-assets.s3.ap-south-1.amazonaws.com/onek_club_nft_pngs/${file_key}.png`,
      media: {
        uri: `https://new-prod-assets.s3.ap-south-1.amazonaws.com/onek_club_nft_assets/${file_key}.mp4`,
        dimensions: "1280x720",
        mimeType: "video/mp4",
      },
      dna: uuidv4(),
      attributes: [
        {
          trait_type: "Generation",
          value: "Zero",
        },
        {
          trait_type: "Series",
          value: "Base",
        },
        {
          trait_type: "Version",
          value: "One",
        },
        {
          trait_type: "Type",
          value: "N/A",
        },
      ],
    };
    let base64data = Buffer.from(JSON.stringify(data));
    const res1 = await s3upload(
      base64data,
      `oneK_club/${user_wallet_address}-${uuidv4()}-metadata.json`,
      "bitfighters",
      "application/json"
    );
    return res1.Location;
  }
}
