export interface BITFIGHTER_ATTRIBUTES {
  speed: number;
  power: number;
}

export enum BITFIGHTER_MINTED {
  MINTED = 10,
  NOT_MINTED = 20,
}

export interface ExtraInfoForNFTs {
  LuckyNumber: number;
  Referer: string;
  NickName: string;
  Partner: string;
  locked: boolean;
  support: boolean;
  // tag: boolean;
  // tatoo: boolean;
  originalMinter: string;
}

export interface IMapIdToURL {
  id: number;
  url: string;
  extra_info: ExtraInfoForNFTs;
}

export enum FightStates {
  STALE = 10,
  STARTED = 20,
  ENDED = 30,
}

export function GetBitfightersRedisKey(user_wallet_address: string) {
  let arr = [
    `${process.env.NODE_ENV || "dev"}`,
    "bitfighters",
    user_wallet_address,
  ];
  return arr;
}

export function GetBitfightersNameRedisKey() {
  let arr = [`${process.env.NODE_ENV || "dev"}`, "bitfighters", "name"];
  return arr;
}

export function GetBitfightersWeb2UserLastMintedIdRedisKey() {
  let arr = [
    `${process.env.NODE_ENV || "dev"}`,
    "bitfighters",
    "web2",
    "last_minted_id",
  ];
  return arr;
}
