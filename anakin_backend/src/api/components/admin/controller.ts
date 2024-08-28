import { ANAKIN_LOGGER } from "@services/logger";
import * as Hapi from "hapi";
import { GeneratorDao } from "../genarator/dao";
import { CronJobManager } from "./job";

export async function runMoneyTransferCronJob(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  try {
    // start cron job to transfer money..
    await CronJobManager.runCronJobForTranferMoneyToWallets()
    return h.response({
      message: "success"
    }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      event: "FAILED_CRON_JOB",
      error: err
    });
    return h.response({
      message: "Failed Cron Job",
      err
    }).code(400);
  }
}

export async function RankAllBrewPartners(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  try {
    // start cron job to transfer money..
    await CronJobManager.RankAllPartners()
    return h.response({
      message: "success"
    }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      event: "FAILED_CRON_JOB",
      error: err
    });
    return h.response({
      message: "Failed Cron Job",
      err
    }).code(400);
  }
}

export async function generatePreSaleNFTV2(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const quantity = Number(payload["quantity"]);
  console.log("payload --", payload)
  try {
    let results = []
    for (let i=0; i < quantity; i++) {
      let res = await  GeneratorDao.GeneratePreSaleNFTV2Admin(
        userWalletAddress, 
      );
      results.push(res)
    }
    return h.response(results).code(200);
  } catch (err) {
    return h.response({
      message: "Som error occured",
      error: err
    }).code(400);
  }
}

// export async function generatePreSaleNFTV2(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   const payload = request.payload || {};
//   const userWalletAddress = payload["user_wallet_address"];
//   const quantity = Number(payload["quantity"]);
//   try {
//     let results = []
//     for (let i=0; i < quantity; i++) {
//       let res = await  GeneratorDao.GeneratePreSaleNFTV2(
//         userWalletAddress, 
//       );
//       results.push(res)
//     }
//     return h.response({
//       data: results
//     }).code(200);
//   } catch (err) {
//     return h.response({
//       message: "Unable To Mint",
//       error: err
//     }).code(400);
//   }
// }
