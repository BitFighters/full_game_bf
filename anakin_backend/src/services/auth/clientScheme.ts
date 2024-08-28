import * as _ from "lodash";
import {
  ServerAuthScheme,
  Server,
  ServerAuthSchemeOptions,
  Request,
  ResponseToolkit,
} from "hapi";
import Boom from "@hapi/boom";
import { isNullOrUndefined } from "util";

export const ClientScheme: ServerAuthScheme = function (
  server: Server,
  options: ServerAuthSchemeOptions,
) {
  return {
    async authenticate(request: Request, h: ResponseToolkit) {
      const clientId = request.headers["x-client-id"];
      const clientSecret = request.headers["x-client-secret"];

      if (isNullOrUndefined(clientId) || isNullOrUndefined(clientSecret)) {
        return Boom.unauthorized(
          "Unauthorized",
          null,
          {},
        );
      }

      if (clientId !== "DarthVader" && clientSecret !== "ZZ") {
        return Boom.unauthorized(
          "Unauthorized",
          null,
          {},
        );
      }
      return h.authenticated({ credentials: {} });
    },
  };
};
