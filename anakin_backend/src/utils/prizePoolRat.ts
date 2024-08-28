

export interface IRatRewardInfo {
  prize: number;
  escapeTime: number;
  rat_uuid: string;
  killed: boolean;
}

export interface IRewardsRatsDropData {
  time: number;
  total_prize: number;
  rats_info: Array<IRatRewardInfo>
}