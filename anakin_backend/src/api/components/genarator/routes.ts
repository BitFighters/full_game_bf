/* eslint no-unused-vars: 0 */

import { Server, ResponseObject } from "hapi";
import { Routes } from "@config/routes_config";
import { AssignBitfighter, createBitfighter, createBitfighterV2, createPartnerBitfighter, genaratorCheck, generatePreSaleDripNFTV2, generatePreSaleNFT, generatePreSaleNFTV2 } from "./controller";

// const ROUTE_PREFIX_V1 = "/v1/";
const ROUTE_PREFIX_V2 = "/v2/";
export function GeneratorAPIs(server: Server, ROUTE_PREFIX: string) {
  // server.route({
  //   method: "GET",
  //   path: ROUTE_PREFIX + Routes.ROUTES.GENERATOR + "check/",
  //   handler: genaratorCheck,
  //   options: {
  //     cors: true,
  //   },
  // });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.GENERATOR + "create/bitfighter/",
  //   handler: createBitfighter,
  //   options: {
  //     cors: true,
  //     timeout: {
  //       server: 10000,
  //     },
  //   },
  // });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX_V2 + Routes.ROUTES.GENERATOR + "create/bitfighter/",
    handler: createBitfighterV2,
    options: {
      cors: true,
      // timeout: {
      //   server: 20000,
      // },
    },
  });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX_V2 + Routes.ROUTES.GENERATOR + "create/bitfighter/partner/",
    handler: createPartnerBitfighter,
    options: {
      cors: true,
    },
  });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.GENERATOR + "assign/bitfighter/",
  //   handler: AssignBitfighter,
  //   options: {
  //     cors: true,
  //     timeout: {
  //       server: 10000,
  //     },
  //   },
  // });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.GENERATOR + "create/preSaleNFT/",
  //   handler: generatePreSaleNFT,
  //   options: {
  //     cors: true,
  //     timeout: {
  //       server: 10000,
  //     },
  //   },
  // });

  // server.route({
  //   method: "POST",
  //   path: "/v2/" + Routes.ROUTES.GENERATOR + "create/preSaleNFT/",
  //   handler: generatePreSaleNFTV2,
  //   options: {
  //     cors: true,
  //     timeout: {
  //       server: 20000,
  //     },
  //   },
  // });

  // server.route({
  //   method: "POST",
  //   path: "/v2/" + Routes.ROUTES.GENERATOR + "create/drip/preSaleNFT/",
  //   handler: generatePreSaleDripNFTV2,
  //   options: {
  //     cors: true,
  //     timeout: {
  //       server: 20000,
  //     },
  //   },
  // });
}
