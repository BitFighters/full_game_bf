/* eslint @typescript-eslint/camelcase: off */
/* eslint import/named: off */

import * as jwt from "jsonwebtoken";
import {
  Request,
  Server,
  ResponseToolkit,
  ServerAuthScheme,
  ServerAuthSchemeOptions,
} from "hapi";
import Boom from "@hapi/boom";
import { ANAKIN_LOGGER } from "@services/logger";
import { isNullOrUndefined } from "util";
import { AUTH_CONFIG } from "@config/auth_config";

export const JwtPlayerScheme: ServerAuthScheme = (
  server: Server,
  options: ServerAuthSchemeOptions,
) => ({
  authenticate: (request: Request, h: ResponseToolkit) => {
    const { authorization } = request.headers;

    // allow all options request to be used
    if (request.method.toUpperCase() === "OPTIONS") {
      ANAKIN_LOGGER.log({
        eventName: "OPTION_AUTHENTICATION_RESPONSE",
        path: request.path,
        method: request.method,
      });
      return h.continue;
    }

    if (isNullOrUndefined(authorization)) {
      return Boom.unauthorized(
        "UnAuthorized",
        null,
        "Authorization Header is not present",
      );
    }
    let decoded;
    try {
      decoded = jwt.verify(authorization, AUTH_CONFIG.JWT_PLAYER_SECRET);
      // console.log("--- decoded ", decoded)
      decoded.is_logged_in = false;
      if (decoded.user_wallet_address) {
        decoded.is_logged_in = true;
      }
    } catch (err) {
      const user = jwt.decode(authorization);
      request.auth.error = err;
      request.auth.artifacts = { user };

      request.auth.isAuthenticated = false;
      return Boom.unauthorized(
        "authorization expired",
        null,
        "JWT_SIGNATURE_VERIFICATION_FAILED",
      );
    }
    return h.authenticated({
      credentials: { user: decoded },
    });
  },
});
