import BITFIGHTER_NFT_SPECS from "@models/bitfighter_nft_specs";
import * as Hapi from "hapi";
import { GeneratorDao } from "./dao";
import fs from "fs";
import { PUBLIC_FOLDER_PATH } from "@config/bitfighter_nft_config";

export async function genaratorCheck(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  // const res = fs.readFileSync(`${PUBLIC_FOLDER_PATH}important.json`)
  return h.response({
    success: "good"
  }).code(200);
}

export async function createBitfighter(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const referer_address = payload["referer_address"];
  const lucky_number = payload["lucky_number"];
  const nick_name = payload["nick_name"];
  const user_type = payload["user_type"];
  // const response = await  GeneratorDao.createBitfighter(
  //   userWalletAddress, 
  //   referer_address, 
  //   lucky_number, 
  //   nick_name,
  //   user_type
  // );
  // return h.response(response).code(200);
}

export async function AssignBitfighter(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const nick_name = payload["nick_name"];
  // const user_type = payload["user_type"];
  const newUserWalletAddress = payload["new_user_wallet_address"];
  try {
    const response = await GeneratorDao.TransferAndDeleteBitfighter(userWalletAddress, nick_name, newUserWalletAddress);
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ success: 0 }).code(400);
  }
}

export async function generatePreSaleNFT(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  try {
    const response = await GeneratorDao.GeneratePreSaleNFT(
      userWalletAddress,
    );
    return h.response({
      data: response
    }).code(200);
  } catch (err) {
    return h.response({
      message: "Unable To Mint",
      error: err
    }).code(400);
  }
}


export async function generatePreSaleNFTV2(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const quantity = Number(payload["quantity"]);
  try {
    let results = []
    for (let i = 0; i < quantity; i++) {
      let res = await GeneratorDao.GeneratePreSaleNFTV2(
        userWalletAddress,
      );
      results.push(res)
    }
    return h.response({
      data: results
    }).code(200);
  } catch (err) {
    return h.response({
      message: "Unable To Mint",
      error: err
    }).code(400);
  }
}


export async function generatePreSaleDripNFTV2(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const quantity = Number(payload["quantity"]);
  const tatoo = String(payload["tatoo"]);
  const tag = String(payload["tag"]);
  try {
    let results = []
    for (let i = 0; i < quantity; i++) {
      let res = await GeneratorDao.GeneratePreSaleDripNFTV2(
        userWalletAddress,
        tatoo,
        tag
      );
      results.push(res)
    }
    return h.response({
      data: results
    }).code(200);
  } catch (err) {
    return h.response({
      message: "Unable To Mint",
      error: err
    }).code(400);
  }
}

export async function createBitfighterV2(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const referer_address = payload["referer_address"];
  const user_type = payload["user_type"];
  const quantity = Number(payload["quantity"]);
  const partnerName = payload["partner_name"] || "Bit Fighter";
  const isDripTattoo = payload["is_drip_tattoo"];
  let dataArr = [];
  console.log("quantity ----- ", quantity, payload["quantity"]);
  try {
    const start_time = Date.now();
    for (let i = 0; i < quantity; i++) {
      let response = GeneratorDao.createBitfighterV3(
        userWalletAddress,
        referer_address,
        user_type,
        partnerName,
        isDripTattoo
      );
      dataArr.push(response)
    }
    dataArr = await Promise.all(dataArr);
    console.log(`generating bitfighters took... ${Date.now() - start_time} ms`)
    // console.log("---------", dataArr);

    return h.response({ data: dataArr }).code(200);
  } catch (err) {
    console.log("error in createBitfighterV2 ", err);
    return h.response({ error: err }).code(400);
  }
}

export async function createPartnerBitfighter(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const referer_address = payload["referer_address"];
  const user_type = payload["user_type"];
  const quantity = Number(payload["quantity"]);
  const partnerName = payload["partner_name"] || "";
  const isDripTattoo = payload["is_drip_tattoo"];
  let dataArr = [];
  console.log("quantity ----- ", quantity, payload["quantity"]);
  try {
    const start_time = Date.now();
    for (let i = 0; i < quantity; i++) {
      let response = GeneratorDao.createPartnerFighter(
        userWalletAddress,
        referer_address,
        user_type,
        partnerName,
      );
      dataArr.push(response)
    }
    dataArr = await Promise.all(dataArr);
    console.log(`generating bitfighters took... ${Date.now() - start_time} ms`)

    return h.response({ data: dataArr }).code(200);
  } catch (err) {
    console.log("error in createBitfighterV2 ", err);
    return h.response({ error: err }).code(400);
  }
}