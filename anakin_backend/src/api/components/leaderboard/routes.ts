/* eslint no-unused-vars: 0 */

import { Server } from "hapi";
import { FetchLeaderboard } from "./controller";

export function LeaderboardAPIS(server: Server, ROUTE_PREFIX: string) {
  server.route({
    method: "GET",
    path: ROUTE_PREFIX + `leaderboard/fetch/`,
    handler: FetchLeaderboard,
    options: {
      cors: {
        credentials: true
      },
      // auth: {
      //   mode: "required",
      //   strategy: "jwtPlayerAuthorization",
      // },
    },
  });



  // server.route({
  //   method: "POST",
  //   path: ROUTE_PREFIX + `leaderboard/update/`,
  //   handler: UpdateLeaderBoard,
  //   options: {
  //     cors: {
  //       credentials: true
  //     },
  //     // auth: {
  //     //   mode: "required",
  //     //   strategy: "clientAuthorization",
  //     // },
  //   },
  // });

}
