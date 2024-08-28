import BetDB from "./BetDB";
import ASSETS_MANAGER from "./assets_manager";
import BITFIGHTER_NFT_SPECS from "./bitfighter_nft_specs";
import FightsDB from "./fightsDB";
import STATS_DB from "./statsDB";
import USER_DETAILS from "./user_details";
import WALLET_DB from "./wallet";
import SYSTEM_WALLET_DB from "./system_wallets";
import WALLET_LOGS from "./wallet_logs";
import USER_ACTIVITY_TRACKING from "./user_activity_tracking";
import BREW_PARTNER_WALLETS_DB from "./partner_wallets";
import CONSTANTS_DB from "./constants";
import WEEKLY_STATS from "./weekly_stats";

export default [
  BITFIGHTER_NFT_SPECS,
  USER_DETAILS,
  FightsDB,
  BetDB,
  STATS_DB,
  WEEKLY_STATS,
  WALLET_DB,
  ASSETS_MANAGER,
  SYSTEM_WALLET_DB,
  WALLET_LOGS,
  USER_ACTIVITY_TRACKING,
  BREW_PARTNER_WALLETS_DB,
  CONSTANTS_DB
];
