/* eslint no-unused-vars: 0 */

import { Server, ResponseObject } from "hapi";
import { Routes } from "@config/routes_config";
import { generatePreSaleNFTV2, RankAllBrewPartners, runMoneyTransferCronJob } from "./controller";

export function AdminAPIs(server: Server, ROUTE_PREFIX: string) {
  // server.route({
  //   method: "POST",
  //   path: `/v1/admin/cash_flow/`,
  //   handler: runMoneyTransferCronJob,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     auth: {
  //       mode: "required",
  //       strategy: "clientAuthorization",
  //     },
  //   },
  // });


  // server.route({
  //   method: "GET",
  //   path: `/v1/admin/brew/partner/rank/`,
  //   handler: RankAllBrewPartners,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     auth: {
  //       mode: "required",
  //       strategy: "clientAuthorization",
  //     },
  //   },
  // });


  // server.route({
  //   method: "POST",
  //   path: `/v1/admin/generate_v2_mint_cards_500/`,
  //   handler: generatePreSaleNFTV2,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     auth: {
  //       mode: "required",
  //       strategy: "clientAuthorization",
  //     },
  //   },
  // });

}
