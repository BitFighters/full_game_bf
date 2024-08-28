export const PRESALE_DRIP_ABI = [{
    "inputs": [{
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": false,
      "internalType": "uint256",
      "name": "_data",
      "type": "uint256"
    }],
    "name": "PrintDataInt",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": false,
      "internalType": "string",
      "name": "_data",
      "type": "string"
    }],
    "name": "PrintDataString",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BFContractAddress",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_tokenIds",
    "outputs": [{
      "internalType": "uint256",
      "name": "_value",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "_tokenID",
      "type": "uint256"
    }],
    "name": "burnMintCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }],
    "name": "changePriceOfPreSaleNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "string",
        "name": "_tokenURI",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_tokenID",
        "type": "uint256"
      }
    ],
    "name": "changeTokenURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "totalQuantity",
      "type": "uint256"
    }],
    "name": "changeTotalPreSaleCoupons",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_sender",
      "type": "address"
    }],
    "name": "checkwbtcBalanceOfAddress",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dripPartnerWallet",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_userAddress",
      "type": "address"
    }],
    "name": "fetchPreSaleCardsOfUser",
    "outputs": [{
      "internalType": "uint256[]",
      "name": "value",
      "type": "uint256[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "_tokenID",
      "type": "uint256"
    }],
    "name": "fetchReferrer",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }],
    "name": "fetchTagInfoOfCard",
    "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }],
    "name": "fetchTattooInfoOfCard",
    "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }],
    "name": "getApproved",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMintedCouponsCount",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "string[]",
        "name": "_tokenURIs",
        "type": "string[]"
      },
      {
        "internalType": "address",
        "name": "_referrerAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "tattoo",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "tag",
        "type": "bool"
      }
    ],
    "name": "mintMultiPresaleDripBitfighterCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "name": "mintedIdToReferrerAddressMapping",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{
      "internalType": "string",
      "name": "",
      "type": "string"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "name": "nftIdToExtraInfoMapping",
    "outputs": [{
        "internalType": "bool",
        "name": "tag",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "tattoo",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "name": "originalMinters",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }],
    "name": "ownerOf",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceOfPreSaleNFT",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceOfTagAddon",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceOfTattooAddon",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceOfTattooAndTagAddon",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "bitfightersContractAddress",
      "type": "address"
    }],
    "name": "setBitfighterContractAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_dripPartnerWallet",
      "type": "address"
    }],
    "name": "setDripPartnerWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_wallet",
      "type": "address"
    }],
    "name": "setSystemWalletAddress1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_wallet",
      "type": "address"
    }],
    "name": "setSystemWalletAddress2",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_wallet",
      "type": "address"
    }],
    "name": "setTreasuryWalletAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "_wbtcContractAddress",
      "type": "address"
    }],
    "name": "setWbtcContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "bytes4",
      "name": "interfaceId",
      "type": "bytes4"
    }],
    "name": "supportsInterface",
    "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{
      "internalType": "string",
      "name": "",
      "type": "string"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "systemWalletAddress1",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "systemWalletAddress2",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }],
    "name": "tokenURI",
    "outputs": [{
      "internalType": "string",
      "name": "",
      "type": "string"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPresaleCoupons",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasuryWalletAddress",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wbtcAddress",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  }
]

const DEV_DRIP_PRESALE_ADDRESS = "0x7551F4Db8cd42F5f52C45Cf73008680442dE09e9"
const PROD_DRIP_PRESALE_ADDRESS = "0xe743eA8Cf23719fEbD082088760B083d4861E0ac" // recheck snowtrace 
export let PRESALE_DRIP_CONTRACT_V2 = ""
if (process.env.REACT_APP_DEV_ENV === "production") {
  PRESALE_DRIP_CONTRACT_V2 = PROD_DRIP_PRESALE_ADDRESS
} else {
  PRESALE_DRIP_CONTRACT_V2 = DEV_DRIP_PRESALE_ADDRESS
}