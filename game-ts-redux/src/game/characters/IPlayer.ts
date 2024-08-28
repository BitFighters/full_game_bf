// {
//     "user_wallet_address": "0xf384cb884b647c24a5d33e949d993e0502e66a92",
//     "nftURL": "https://dev-bitfighters.s3.ap-south-1.amazonaws.com/0xf384cb884b647c24a5d33e949d993e0502e66a92-01112110-0x7F17DC2E6F8Db43A1951Bc2bce0E7AD62e3fB174metadata.json",
//     "contract_address": "0x7F17DC2E6F8Db43A1951Bc2bce0E7AD62e3fB174",
//     "dna": "01112110",
//     "minted": 10,
//     "nick_name": "Vader",
//     "referer_address": "0x0000000000000000000000000000000000000000",
//     "lucky_number": 5,
//     "created_at": "2022-08-09T05:19:47.000Z",
//     "updated_at": "2022-08-09T05:19:47.000Z",
//     "data": {
//         "name": "BitFighter.",
//         "description": "Your cool BitFighter.",
//         "sprite_image": "https://dev-bitfighters.s3.ap-south-1.amazonaws.com/0xf384cb884b647c24a5d33e949d993e0502e66a92-01112110-sprite.png",
//         "image": "https://dev-bitfighters.s3.ap-south-1.amazonaws.com/0xf384cb884b647c24a5d33e949d993e0502e66a92-01112110-nft.png",
//         "attributes": [
//             {
//                 "trait_type": "dna",
//                 "value": "01112110"
//             },
//             {
//                 "trait_type": "defense",
//                 "value": 1
//             },
//             {
//                 "trait_type": "speed",
//                 "value": 3
//             },
//             {
//                 "trait_type": "kickpower",
//                 "value": 3
//             },
//             {
//                 "trait_type": "punchpower",
//                 "value": 2
//             },
//             {
//                 "trait_type": "weapons",
//                 "value": 1
//             },
//             {
//                 "trait_type": "health",
//                 "value": 2
//             },
//             {
//                 "trait_type": "stamina",
//                 "value": 2
//             },
//             {
//                 "trait_type": "kickspeed",
//                 "value": 5
//             },
//             {
//                 "trait_type": "punchspeed",
//                 "value": 2
//             },
//             {
//                 "trait_type": "thorwing",
//                 "value": 4
//             }
//         ]
//     }
// }

export interface IDataNFT {
  sprite_image: string;
  attributes: any;
  image: string;
}

export interface IPlayerData {
  user_wallet_address: string;
  nftURL: string;
  contract_address: string;
  dna: string;
  minted: number;
  minted_id: number;
  nick_name: string;
  referer_address: string;
  lucky_number: number;
  data: IDataNFT;
}

export interface INFTDataOfConnections {
  walletAddress: string;
  status: number;
  status_timer: number;
  sprite_url: string;
  all_nft_data: any;
  last_position_x: number;
  last_position_y: number;
  moved_last_frame?: boolean;
  orientation: string;
  fighting: boolean;
  minted_id: number;
  nick_name: string;
  defense: number;
  speed: number;
  walk_speed?: number;
  run_speed?: number;
  kickpower: number;
  punchpower: number;
  health: number;
  stamina: number;
  stamina_regeneration?: number;
  max_stamina: number;
  max_health: number;
  profile_image: string;
  stunned: boolean;
  all_aps?: any;

  user_type?: string;

  movementAbility?: string;
}

export interface IKeyAttributes {
  pressed: boolean;
  time_last_pressed?: number;
  double_pressed?: boolean;
  time_last_lifted?: number;
}

export interface IKeysInfo {
  keyA: IKeyAttributes;
  keyD: IKeyAttributes;
  keyS: IKeyAttributes;
  keyW: IKeyAttributes;
  keyP: IKeyAttributes;
  keyK: IKeyAttributes;
  keyQ: IKeyAttributes;
  lastKey: string;
  lastLifted?: string;
  leftShift: IKeyAttributes;
  keyBlock: IKeyAttributes;
}
