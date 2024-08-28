export const DB_CONFIG = {
  DATABASE_CONNECTION: {
    REGION: "ap-south-1",
    ACCESS_KEY_ID: "",
    SECRET_ACCESS_KEY: "",
    TABLE_NAME_PREFIX: (process.env.NODE_ENV || "dev") + "_",
    // TABLE_NAME_PREFIX: process.env.NODE_ENV === "local" ? "local_" :
  },
  TABLES: {
    BITFIGHTER_NFT_SPECS: "bitfighter_nft_specs",
    USER_DETAILS: "user_details",
    QUEUE_DB: "queue_db",
    FRIENDS_DB: "friends_db",
    FIGHTS_DB: "fights_db",
    WEB2_USERS: "web2_users",
    STATS_DB: "stats_db",
    WEEKLY_STATS_DB: "weekly_stats",
    CONSTANTS_DB: "constants",
    WALLET_DB: "wallet_db",
    WALLET_LOGS: "wallet_logs",
    USER_ACTIVITY_TRACKING: "user_activity_tracking",
    SYSTEM_WALLETS_DB: "all_wallets",
    BREW_PARTNER_WALLETS_DB: "brew_partner_info",
    ASSETS_MANAGER: "assets_manager",
    BET_DB: "bet_db",
    PRIZE_DROP_CONSTANTS_DB: "prize_drop_constants_db",
  },
};
