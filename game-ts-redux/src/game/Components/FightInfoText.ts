

export class FightInfoText {
  FightpPayer1InfoText!: Phaser.GameObjects.Text
  FightpPayer2InfoText!: Phaser.GameObjects.Text
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.FightpPayer1InfoText = this.scene.add
      .text(0, 0, 'Player1', {font: '128px Courier'})
      .setOrigin(0.5)
      .setStyle({ backgroundColor: '#f5eddc', borderRadius: 5 })
      .setColor("#000")
      .setPadding(2)
      .setScale(0.1)

    this.FightpPayer2InfoText = this.scene.add
      .text(0, 0, 'Player2', {font: '128px Courier'})
      .setOrigin(0.5)
      .setStyle({ backgroundColor: '#f5eddc', borderRadius: 5 })
      .setColor("#000")
      .setPadding(2)
      .setScale(0.1)
  }



  // showText() {

  // }

  // hideText() {

  // }
}