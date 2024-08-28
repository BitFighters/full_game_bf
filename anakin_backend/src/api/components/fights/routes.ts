/* eslint no-unused-vars: 0 */

import { Server, ResponseObject } from "hapi";
import { Routes } from "@config/routes_config";
import { BetIntoFight, BetIntoFightAdmin, FightEnds, FightEntryAdd, FightEntryAddAdmin, FightEntryCreate, FightEntryCreateAdmin, FightEntryCreateV2, FightQueueEnter, FightQueueEnterAdmin, FightQueueExit, FightQueuePoolExit, FightResultUpdate, FightStateUpdate, GetBetInfo, GetBetsInfo, GetFightEntryInfo, JackPotWinEvent } from "./controller";

export function FightAPI(server: Server, ROUTE_PREFIX: string) {

  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `queue/enter/`,
    handler: FightQueueEnter,
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
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `admin/queue/enter/`,
    handler: FightQueueEnterAdmin,
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

  // this is called from game server when the user exits the queue by manually or disconnected.
  server.route({
    method: "POST",
    path: `/v1/fight/queue/exit/`,
    handler: FightQueueExit,
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

  // this api is called when the server tells to create a fight id for a user. 
  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `fight_entry/create/`,
    handler: FightEntryCreate,
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
    path: `/v1/admin/fight_entry/create/`,
    handler: FightEntryCreateAdmin,
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
    path: `/v2/fight/fight_entry/create/`,
    handler: FightEntryCreateV2,
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
    path: `/v2/fight/queue/exit/`,
    handler: FightQueuePoolExit,
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

  // this api is called when game server tell to add another user to existing fight id.
  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `fight_entry/add/`,
    handler: FightEntryAdd,
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
    path: `/v1/admin/fight_entry/add/`,
    handler: FightEntryAddAdmin,
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
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `bet/fetch/{fight_id}/`,
    handler: GetBetInfo,
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
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `bets/fetch/`,
    handler: GetBetsInfo,
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
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `bet/add/`,
    handler: BetIntoFight,
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
  //   path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `admin/bet/add/`,
  //   handler: BetIntoFightAdmin,
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

  server.route({
    method: "GET",
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `info/fetch/{fight_id}/`,
    handler: GetFightEntryInfo,
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
  //   path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `info/server/fetch/{fight_id}/`,
  //   handler: GetFightEntryInfoClient,
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

  // this api is called by the game server when fight ends. and this takes care of the fund transfer
  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `end/`,
    handler: FightEnds,
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

  // this api is called by the game server to update the results. of the fight.
  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `update/result/`,
    handler: FightResultUpdate,
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

  // will be called by game server when both players accept the fight
  server.route({
    method: "POST",
    path: ROUTE_PREFIX + Routes.ROUTES.FIGHT + `update/state/`,
    handler: FightStateUpdate,
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
    path: ROUTE_PREFIX +`jackpot/win/`,
    handler: JackPotWinEvent,
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
