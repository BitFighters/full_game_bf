/* eslint no-unused-vars: 0 */

import { Server } from "hapi";
import { GeneratorAPIs } from "@api/components/genarator/routes";
import { Web3APIs } from "./components/web3/routes";
import { UserAPIs } from "./components/users/routes";
import { AuthAPIs } from "./components/auth/routes";
import { InternalAPIs } from "./components/internal/routes";
import { WalletsAPI } from "./components/wallets/routes";
import { FightAPI } from "./components/fights/routes";
import { ServerAPIs } from "./components/servers/routes";
import { AdminAPIs } from "./components/admin/routes";
import { LeaderboardAPIS } from "./components/leaderboard/routes";



const ROUTE_PREFIX_V1 = "/v1/";

export function initAllRoutes(server: Server) {
  new GeneratorAPIs(server, ROUTE_PREFIX_V1);
  new Web3APIs(server, ROUTE_PREFIX_V1);
  new UserAPIs(server, ROUTE_PREFIX_V1);
  new AuthAPIs(server, ROUTE_PREFIX_V1);
  new InternalAPIs(server, ROUTE_PREFIX_V1);
  new WalletsAPI(server, ROUTE_PREFIX_V1);
  new FightAPI(server, ROUTE_PREFIX_V1);

  new ServerAPIs(server, ROUTE_PREFIX_V1);

  new AdminAPIs(server, ROUTE_PREFIX_V1);
  new LeaderboardAPIS(server, ROUTE_PREFIX_V1);
}
