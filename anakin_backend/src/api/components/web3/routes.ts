/* eslint no-unused-vars: 0 */

import { Server, ResponseObject } from "hapi";
import { Routes } from "@config/routes_config";
import { AddUserToQueue, CheckIfNickNameExist, DeleteUserFromQueue, FetchBitFighters, GetAllUsersFromQueueDB, HandleBitfgihterUpdate, HandleOneKCardUpdate, HandleSingleBitfgihterUpdate, MoralisGetPluginSpec } from "./controller";

export function Web3APIs(server: Server, ROUTE_PREFIX: string) {
  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `update/bitfighters/{user_wallet_address}/`,
    handler: HandleBitfgihterUpdate,
    options: {
      cors: true,
    },
  });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `update/bitfighters/{user_wallet_address}/{minted_id}/`,
    handler: HandleSingleBitfgihterUpdate,
    options: {
      cors: true,
    },
  });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `update/one_k_card/{user_wallet_address}/`,
    handler: HandleOneKCardUpdate,
    options: {
      cors: true,
    },
  });

  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `fetch/bitfighters/{user_wallet_address}/`,
    handler: FetchBitFighters,
    options: {
      cors: true,
    },
  });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `user/add/queue/`,
    handler: AddUserToQueue,
    options: {
      cors: {
        credentials: true
      },
      auth: {
        mode: "required",
        strategy: "jwtAuthorization",
      },
    },
  });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `user/delete/queue/`,
    handler: DeleteUserFromQueue,
    options: {
      cors: {
        credentials: true
      },
      auth: {
        mode: "required",
        strategy: "jwtAuthorization",
      },
    },
  });

  // TODO: will add client auth here..
  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `user/update/queue/`,
  //   handler: TransferFromQueueToFightDB,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //   },
  // });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `user/update/queue/down/{user_wallet_address}/`,
  //   handler: TransferFromStartToEndofQueue,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //   },
  // });


  // internal
  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `users/get/queue/`,
    handler: GetAllUsersFromQueueDB,
    options: {
      cors: {
        credentials: true
      },
    },
  });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.WEB3 + `users/executeFightEnd/`,
  //   handler: ExecuteFightEnd,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //   },
  // });

  server.route({
    method: "GET",
    path: ROUTE_PREFIX + `users/{nick_name}/acceptable/`,
    handler: CheckIfNickNameExist,
    options: {
      cors: {
        credentials: true
      },
    },
  });

  server.route({
    method: "POST",
    path: `/functions/getPluginSpecs`,
    handler: MoralisGetPluginSpec,
    options: {
      cors: {
        credentials: true
      },
    },
  });


}
