import Phaser from 'phaser';

class XPBar extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private xpText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, maxXP: number) {
    super(scene, x, y);

    // Create the oval background
    this.background = scene.add.graphics();
    this.background.fillStyle(0x808080);
    this.background.fillEllipse(0, 0, 300, 100);
    this.add(this.background);

    // Create the progress bar
    this.progressBar = scene.add.graphics();
    this.add(this.progressBar);

    // Create the text for XP display
    this.xpText = scene.add.text(0, 0, 'XP: 0/' + maxXP, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff', // Corrected property name
    });
    this.xpText.setOrigin(0.5, 0.5);
    this.add(this.xpText);

    scene.add.existing(this);
  }

  updateXP(currentXP: number, maxXP: number) {
    const progress = Math.min(currentXP / maxXP, 1); // Limit the progress to 1
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffa500);
    this.progressBar.fillEllipse(0, 0, 300 * progress, 100);

    this.xpText.setText(`XP: ${currentXP}/${maxXP}`);
  }

  levelUp() {
    // Clear the progress bar when leveling up
    this.progressBar.clear(); 
  }
}

export default XPBar;
