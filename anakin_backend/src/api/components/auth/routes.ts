/* eslint no-unused-vars: 0 */

import { Server, ResponseObject } from "hapi";
import { Routes } from "@config/routes_config";
import { CheckIfUserSignedMetamask, HealthCheckAuthAPI, LoginUserAndAuthenticate, LoginUserAndAuthenticateBitFighters, SaveSignatureOfUser } from "./controller";

export function AuthAPIs(server: Server, ROUTE_PREFIX: string) {
  // server.route({
  //   method: "GET",
  //   path: ROUTE_PREFIX + Routes.ROUTES.AUTH + `check/`,
  //   handler: HealthCheckAuthAPI,
  //   options: {
  //     cors: true,
  //   },
  // });

  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.AUTH + `login/{user_wallet_address}/`,
    handler: LoginUserAndAuthenticate,
    options: {
      cors: true,
    },
  });

  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.AUTH + `check/signed/{user_wallet_address}/`,
    handler: CheckIfUserSignedMetamask,
    options: {
      cors: true,
    },
  });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.AUTH + `save/signature/{user_wallet_address}/`,
    handler: SaveSignatureOfUser,
    options: {
      cors: true,
    },
  });

  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.AUTH + `login/player/{user_wallet_address}/{minted_id}/`,
    handler: LoginUserAndAuthenticateBitFighters,
    options: {
      cors: true,
    },
  });

}
