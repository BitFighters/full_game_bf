/* eslint no-unused-vars: 0 */

import { Server, ResponseObject } from "hapi";
import { Routes } from "@config/routes_config";
import { AcceptFriendRequest, AddAssets, DisccardAssets, FetchAssetsOfUser, FetchPartnersInfo, FetchPriceOfAsset, FetchWeb2User, GetFriends, HealthCheckUserAPIs, LoginWeb2User, RegisterWeb2User, SendFriendRequest } from "./controller";

export function UserAPIs(server: Server, ROUTE_PREFIX: string) {
  // server.route({
  //   method: "GET",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `check/`,
  //   handler: HealthCheckUserAPIs,
  //   options: {
  //     cors: true,
  //   },
  // });

  // will change all of these apis to use AUTH
  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `send/friend/request/{user_wallet_address}/`,
  //   handler: SendFriendRequest,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     auth: {
  //       mode: "required",
  //       strategy: "jwtAuthorization",
  //     },
  //   },
  // });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `accept/friend/request/{user_wallet_address}/`,
  //   handler: AcceptFriendRequest,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     auth: {
  //       mode: "required",
  //       strategy: "jwtAuthorization",
  //     },
  //   },
  // });

  // server.route({
  //   method: "GET",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `fetch/friends/{minted_id}/`,
  //   handler: GetFriends,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     auth: {
  //       mode: "required",
  //       strategy: "jwtAuthorization",
  //     },
  //   },
  // });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `web2/user/register/`,
  //   handler: RegisterWeb2User,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     // auth: {
  //     //   mode: "required",
  //     //   strategy: "jwtAuthorization",
  //     // },
  //   },
  // });

  // server.route({
  //   method: "GET",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `web2/user/fetch/{email}/`,
  //   handler: FetchWeb2User,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //   },
  // });

  // server.route({
  //   method: "GET",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `web2/user/login/{email}/{password}/`,
  //   handler: LoginWeb2User,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //   },
  // });

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.USERS + `assets/add/`,
    handler: AddAssets,
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
    path: ROUTE_PREFIX + `internal/assets/add/`,
    handler: AddAssets,
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

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.USERS + `assets/discard/`,
    handler: DisccardAssets,
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
    path: ROUTE_PREFIX + Routes.ROUTES.USERS + `assets/fetch/`,
    handler: FetchAssetsOfUser,
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
    path: `/v1/users/partners/fetch/`,
    handler: FetchPartnersInfo,
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
  //   method: "GET",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `assets/{asset_name}/price/fetch/`,
  //   handler: FetchPriceOfAsset,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     auth: {
  //       mode: "required",
  //       strategy: "jwtPlayerAuthorization",
  //     },
  //   },
  // });

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.USERS + `connect/game/`,
  //   handler: ConnectWSURL,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     auth: {
  //       mode: "required",
  //       strategy: "jwtPlayerAuthorization",
  //     },
  //   },
  // });

}
