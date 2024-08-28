import 'dotenv/config'

export const WEB_3_CONFIG = {
  CONTRACT_ADDRESS: (process.env.NODE_ENV == "production") ? "0x37f956b72255F8ca75202627d96C319F31c751A1" : "0xfA34D58532626d3265e082EFcd1788FDE7FaDc88",
  Onek_CARDS_CONTRACTS_ADDRESS: (process.env.NODE_ENV == "production") ? "0xD72e26baF7598C86D0CFC8f569838436f6EB98a1" : "0xc2865507178CE9FAec11993aF39f799f48d11DDD",
  GAMELOGIC_CONTRACT_ADDRESS: (process.env.NODE_ENV == "production") ? "0xD49D1cA1FF72E043a5FEE7c48Ddb785B44A7dB90" : "0xDA0B8aB699364dDC2c0f7D025D66E9a2234710b8",
  WBTC_ADDRESS: (process.env.NODE_ENV === "production") ? "0x152b9d0FdC40C096757F570A51E494bd4b943E50" : "0x77812A15bbEa11671e26449316B74B6695C23033",
  WEB3_RPC_URL: (process.env.NODE_ENV == "production") ? "https://polygon-mainnet.g.alchemy.com/v2/4sTMivTEPD_82LNTASozosfZ0c7Agzni" : "https://polygon-mumbai.g.alchemy.com/v2/XY3ND8bGsw9B8h5Y4CVA9fAyynz74Kyl",
  ALCHEMY_API_KEY: "XY3ND8bGsw9B8h5Y4CVA9fAyynz74Kyl",
  AVAX_WEB3_RPC_URL: (process.env.NODE_ENV == "production") ? "https://api.avax.network/ext/bc/C/rpc" : "https://bob-sepolia.rpc.gobob.xyz",
  NETWORK: "maticmum",
  ATM_VAULT_ADDRESS: (process.env.NODE_ENV == "production") ? "0xA7eE2B894d97Ad50FB36C7f3B803fd62455CC5e5" : "0x69E653020C24Ea59890B4c10731A887FF444438D",
  GAME_LOGIC_AND_BITFIGHTERS_OWNER: (process.env.NODE_ENV == "production") ? process.env.PROD_OWNER_OF_GAME_LOGIC_AND_BITFIGHTERS_SECRET_KEY : process.env.DEV_OWNER_OF_GAME_LOGIC_AND_BITFIGHTERS_SECRET_KEY,
  ONEK_CLUB_OWNER: (process.env.NODE_ENV == "production") ? process.env.PROD_OWNER_OF_ONEK_CLUB_SECRET_KEY : process.env.DEV_OWNER_OF_ONEK_CLUB_SECRET_KEY,
};