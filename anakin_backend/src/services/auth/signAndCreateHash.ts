import { AUTH_CONFIG } from "@config/auth_config";
import USER_DETAILS from "@models/user_details";
import * as jwt from "jsonwebtoken";

export function signDataForAuth(data: any) {
  const token = jwt.sign(
    data,
    AUTH_CONFIG.JWT_SECRET,
    {
      expiresIn: "3h",
    }
  );
  return token;
}

export function signDataForPlayerAuth(data: any) {
  const token = jwt.sign(
    data,
    AUTH_CONFIG.JWT_PLAYER_SECRET,
    {
      expiresIn: 60*60* 24,
    }
  );
  return token;
}