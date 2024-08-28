import { ANAKIN_LOGGER } from "@services/logger";

/* eslint-disable-next-line */
const GetLocoNowRegx = new RegExp("((https|http)?://([a-z0-9A-Z\-]+[.])*getloconow\.com(:[0-9]+)?)");
/* eslint-disable-next-line */
const LocoGGRegx = new RegExp("((https|http)?://([a-z0-9A-Z\-]+[.])*loco\.gg(:[0-9]+)?)");
/* eslint-disable-next-line */
const EasyVideoRegx = new RegExp("((https|http)?://([a-z0-9A-Z\-]+[.])*easyvideo\.in(:[0-9]+)?)");

function init(server) {
  // setup the CORS pre-flight request paths on all available endpoints
  const routes = server.table().map(item => item.path);

  // if there is a GET and POST, etc then remove dupes at same path.
  const dedupeRoutes = [...(new Set<any>(routes))];
  for (let index = 0; index < dedupeRoutes.length; index += 1) {
    const route = dedupeRoutes[index];
    server.route({
      method: "OPTIONS",
      path: route,
      config: {
        cors: {
          maxAge: 1728000,
          headers: ["Origin", "Accept", "X-Requested-With", "Content-Type"],
          credentials: true,
          origin: ["*"],
        },
        handler() {
          ANAKIN_LOGGER.log({
            eventName: "CORS_REQUEST_HANDLER",
          });
          return {
            cors: "true",
          };
        },
      },
    });
  }

  ANAKIN_LOGGER.log({
    eventName: "CORS_INIT",
    routeCount: routes.length,
  });
}

async function appendHeaders(request, h) {
  if (request.method.toUpperCase() !== "OPTIONS") {
    return h.continue;
  }

  const reqOrigin = request.headers.origin;
  let origin;
  const allowCreds = true;

  if (GetLocoNowRegx.test(reqOrigin)) {
    origin = reqOrigin;
  } else if (LocoGGRegx.test(reqOrigin)) {
    origin = reqOrigin;
  } else if (EasyVideoRegx.test(reqOrigin)) {
    origin = reqOrigin;
  }

  // boom requests handles response obj differently
  const response = request.response.isBoom ? request.response.output : request.response;

  if (origin && origin.length > 0) {
    response.headers["Access-Control-Allow-Origin"] = origin;
  }
  response.headers["Access-Control-Allow-Credentials"] = allowCreds;
  response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE";
  response.headers["Access-Control-Allow-Headers"] = "accesstoken,Accept-language,authorization,Content-Type,x-app-version,x-platform";
  response.headers["Access-Control-Max-Age"] = 1728000;
  response.headers["cache-control"] = "max-age=30";
  return h.continue;
}

export const CORS = {
  name: "cors",
  version: "1.1.0",
  async register(server, options) {
    init(server);
    server.ext("onPreResponse", appendHeaders);
  },
};
