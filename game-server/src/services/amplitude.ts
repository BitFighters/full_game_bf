import { init, track } from '@amplitude/analytics-node';
init('435f55938ef09712f694d625bd938c2a');

export class AmplitudeService {
  static exportDataToAmplitude(data: any, event: string, userId: string) {
    // console.log("successfuly sent data -- to amplitude - ", data,  userId)
    // track(
    //   event, 
    //   data, 
    //   {
    //     user_id: userId,
    //   },
    // );
  }

  static exportFightInfo(user1: string, user2: string) {
    // this.exportDataToAmplitude(
    //   {
    //     winner: user1,
    //   },
    //   "fight_info", user1
    // )
    // this.exportDataToAmplitude(
    //   {
    //     loser: user1,
    //   },
    //   "fight_info", user2
    // )
  }
}
