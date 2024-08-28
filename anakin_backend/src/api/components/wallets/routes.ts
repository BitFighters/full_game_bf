/* eslint no-unused-vars: 0 */

import { Server, ResponseObject } from "hapi";
import { Routes } from "@config/routes_config";
import { CreateasystemWallets, FetchSystemWalletsInfo, FetchUserWalletInfo, FetchWalletLogs, RedeemMoneyFromWallet, UpdateWalletInfo } from "./controller";

export function WalletsAPI(server: Server, ROUTE_PREFIX: string) {
  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.WALLET + `fetch/`,
    handler: FetchUserWalletInfo,
    options: {
      cors: {
        credentials: true
      },
      auth: {
        mode: "required",
        strategy: "jwtPlayerAuthorization",
      },
    },
  });

  server.route({
    method: "GET",
    path: `/v1/wallet/logs/fetch/`,
    handler: FetchWalletLogs,
    options: {
      cors: {
        credentials: true
      },
      auth: {
        mode: "required",
        strategy: "jwtPlayerAuthorization",
      },
    },
  });

  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.WALLET + `update/`,
    handler: UpdateWalletInfo,
    options: {
      cors: {
        credentials: true
      },
      auth: {
        mode: "required",
        strategy: "jwtPlayerAuthorization",
      },
    },
  });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.WALLET + `redeem/`,
    handler: RedeemMoneyFromWallet,
    options: {
      cors: {
        credentials: true
      },
      auth: {
        mode: "required",
        strategy: "jwtPlayerAuthorization",
      },
    },
  });

  server.route({
    method: "GET",
    path: `/v1/wallet/system/fetch/`,
    handler: FetchSystemWalletsInfo,
    options: {
      cors: {
        credentials: true
      },
      auth: {
        mode: "required",
        strategy: "jwtPlayerAuthorization",
      },
    },
  });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.WALLET + `add/`,
  //   handler: AddUserWalletInfo,
  //   options: {
  //     cors: true,
  //   },
  // });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.WALLET + `create/system/wallets/`,
    handler: CreateasystemWallets,
    options: {
      cors: {
        credentials: true
      },
      auth: {
        mode: "required",
        strategy: "clientAuthorization",
      },
    },
  });
}
