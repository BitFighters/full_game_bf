import { IFightInfo } from "interfaces";


export class FightHandler {
  
  static fightInfo: IFightInfo = {
      player1: '',
      player2: '',
      player1_nickname: '',
      player2_nickname: '',
      requestSentPlayer1: false,
      requestSentPlayer2: false,
      requestSentTime: 0,
      acceptSentPlayer1: false,
      acceptSentPlayer2: false,
      preFightStageStarted: false,
      prefightStageStartedAt: 0,
      fightStageStarted: false,
      fightStageStartedAt: 0,
      postFightStageStarted: false,
      postFightStageStartedAt: 0,
      preFightAnnouncementStarted: false,
      preFightAnnouncementEnded: false,
      fightEndedAt: 0,
      fightEnds: true,
      fight_id: '',
    }

  static stopFightForSomeEvent = false;

  public static resetFightInfo() {
    this.stopFightForSomeEvent = false;
    this.fightInfo = {
      player1: '',
      player2: '',
      player1_nickname: '',
      player2_nickname: '',
      requestSentPlayer1: false,
      requestSentPlayer2: false,
      requestSentTime: 0,
      acceptSentPlayer1: false,
      acceptSentPlayer2: false,
      preFightStageStarted: false,
      prefightStageStartedAt: 0,
      fightStageStarted: false,
      fightStageStartedAt: 0,
      postFightStageStarted: false,
      postFightStageStartedAt: 0,
      preFightAnnouncementStarted: false,
      preFightAnnouncementEnded: false,
      fightEndedAt: 0,
      fightEnds: true,
      fight_id: '',
    }
  }

  // public static stopFutureFights(state: boolean) {
  //   this.stopFightForSomeEvent = state;
  // }
  
}