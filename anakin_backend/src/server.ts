import "module-alias/register";
import Hapi from "@hapi/hapi";
import Inert from '@hapi/inert'
import { ensureTablesExist } from "@services/db";
import { initAllRoutes } from "@api/routes";
import { ANAKIN_LOGGER } from "@services/logger";
import { get as _get } from "lodash";
import { JwtScheme } from "@services/auth/jwtAuthSchema";
import { JwtPlayerScheme } from "@services/auth/jwtAuthSchemaForPlayer";
import { ClientScheme } from "@services/auth/clientScheme";
import { WEB_3_CONFIG } from "@config/web3_config";
import { LoopWorker } from "./loopWorker";
import { RedClient } from "@services/redis";

const PORT = process.env.PORT || 3000;

const server = Hapi.server({
  port: PORT,
  host: '0.0.0.0',
  routes: {
    cors: true,
  },
});

server.auth.scheme("jwtAuthScheme", JwtScheme);
server.auth.scheme("jwtAuthPlayercheme", JwtPlayerScheme);
server.auth.strategy("jwtAuthorization", "jwtAuthScheme");
server.auth.strategy("jwtPlayerAuthorization", "jwtAuthPlayercheme");
server.auth.scheme("clientAuthScheme", ClientScheme);
server.auth.strategy("clientAuthorization", "clientAuthScheme");

const init = async () => {
  console.log("here.......");
  console.log("onek club addres --", WEB_3_CONFIG.Onek_CARDS_CONTRACTS_ADDRESS)
  await server.register([
    {
      plugin: Inert,
    }
  ]);
  server.route({
    method: "GET",
    path: "/",
    handler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
      return h.file('./index.html');
    },
    options: {
      cors: true,
    },
  });

  server.route({
    method: "GET",
    path: "/favicon.ico",
    handler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
      return h.file('./favicon.ico');
    },
    options: {
      cors: true,
    },
  });
  initAllRoutes(server);
  await ensureTablesExist();
  server.events.on("response", handleResponse);
  await server.start();
  await RedClient.StartRedis();
  ANAKIN_LOGGER.info(`Server running at: ${server.info.uri}`);
  ANAKIN_LOGGER.info("fetching one k club members")
  LoopWorker.Work()
};

const handleResponse = function (request) {
  try {
    const response: any = request.response || {};
    if (request.route.path !== "/") {
      ANAKIN_LOGGER.info({
        eventName: "RESPONSE_LOG",
        path: request.route.path,
        method: request.route.method,
        statusCode: response.statusCode,
        url: request.url,
        payload: request.payload,
        query_params: request.query,
        responseTime: request.info.completed - request.info.received,
      });
    }
  } catch (e) {
    ANAKIN_LOGGER.error({
      event: "error_handleResponse",
      e,
    });
  }
};

init()
  .then((res) => ANAKIN_LOGGER.info("API Server started successfully."))
  .catch((error) => {
    ANAKIN_LOGGER.error("Failed to start API Server.", error)
    process.exit();
  });

process.on("unhandledRejection", (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  ANAKIN_LOGGER.error("UnhandledRejection", {
    reason: reason,
    event: "UnhandledRejectionError"
  });
});

process.on('uncaughtException', function (err) {
  console.log(`Uncaught exception: ${err.message}`);
  ANAKIN_LOGGER.error("UncaughtException", {
    message: err.message,
    stack: err.stack,
    event: "UncaughtExceptionError"
  })
});