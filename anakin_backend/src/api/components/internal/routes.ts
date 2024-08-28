/* eslint no-unused-vars: 0 */

import { Server } from "hapi";
import { DeleteUserFromQueue, RatKillReceiveReward, ReceiveAdminItem } from "./controller";

export function InternalAPIs(server: Server, ROUTE_PREFIX: string) {


  server.route({
    method: "POST",
    path: `/internal/delete/queue/`,
    handler: DeleteUserFromQueue,
    options: {
      cors: {
        credentials: true
      },
    },
  });

  server.route({
    method: "POST",
    path: `/v1/internal/receive/reward/`,
    handler: RatKillReceiveReward,
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
    path: `/v1/internal/receive/admin/reward/`,
    handler: ReceiveAdminItem,
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
