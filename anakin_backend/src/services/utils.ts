import * as Hapi from "hapi";


export function makeTableName(name: string): string {
  let prefix: string;
  if (process.env.NODE_ENV == "production") {
    prefix  = "prod_"
  } else prefix = "dev_"
  console.log("node env ..-> ", process.env.NODE_ENV, `${prefix}${name}`)
  return `${prefix}${name}`;
}

export function addCorsArray(response: Hapi.ResponseObject) {
  response.headers["Access-Control-Allow-Credentials"] = "*";
  response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE";
  response.headers["Access-Control-Allow-Headers"] = "accesstoken,Accept-language,authorization,Content-Type,x-app-version,x-platform";
  // response.headers["Access-Control-Max-Age"] = 1728000;
  return response;
}

export interface PlayerAuthCredentials {
  user_wallet_address: string,
  nftURL: string,
  iat: number,
  exp: number,
  is_logged_in: boolean
}