/* eslint no-unused-vars: 0 */

import { Server, ResponseObject } from "hapi";
import { Routes } from "@config/routes_config";
import { FetchInfoOfRoom, ListGameServers } from "./controller";

export function ServerAPIs(server: Server, ROUTE_PREFIX: string) {

  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + Routes.ROUTES.SERVER + `create/`,
  //   handler: CreateGameServer,
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


  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.SERVER + `list/{region}/{create}/`,
    handler: ListGameServers,
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
    path: ROUTE_PREFIX + Routes.ROUTES.SERVER + `fetch/{room_id}/`,
    handler: FetchInfoOfRoom,
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

}
