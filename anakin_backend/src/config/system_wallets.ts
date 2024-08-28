
export const SYSTEM_WALLETS = {
  Treasury: "Treasury",
  // PrizePool1: "PP1",
  // PrizePool2: "PP2",
  // PrizePool3: "PP3",
  // PrizePool4: "PP4",
  PrizePool5: "PP5",
  // PrizePool6: "PP6",

  // JackPot1: "JP1",
  // JackPot2: "JP2",
  // JackPot3: "JP3",
  // JackPot4: "JP4",
  JackPot5: "JP5",
  System: 'system',
};

export const PARTNER_WALLETS = {
  DRIP: "drip"
}

export const SYSTEM_WALLETS_MAPPING_TO_WEB3 = {
  Treasury: (process.env.NODE_ENV == "production")? "0x8089b110B81a9215F07D57b01bEB506f17604dc4": "0x1D5215041824138CB82576e961e10eA350D7ed99",
  System1:  (process.env.NODE_ENV == "production")? "0x0Ef286C13dC7aF4cC416FC45beE5CF42d2B10A16": '0x01135d54F00EF92F289a068C1478478E5c3eECC0',
  System2:  (process.env.NODE_ENV == "production")? "0xE9f26c66a40894d284dA933Af89ac57613298956": '0x940B3c799069BfB20902EC298A44F7f20672bcf4'
};

export const PARTNER_WALLETS_MAPPING_WEB3 = {
  DRIP:  (process.env.NODE_ENV == "production")? "0x14cbce72c4c3c788e496044339901a897afd19ee": "0x941b6ddb7d0CEab7200aFC6b40c6Eec598A15Af7"
}
