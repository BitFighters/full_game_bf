// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_SPRITE_DISPLAY_HEIGHT } from '../configs';

export interface IBrew {
  brew_id: string,
  // posX: number,
  // posY: number,
  // eject_animating: boolean,
  // magnet_animating: boolean,
  // target?: string,
  // picked_by: string,
  // created_time: number,
  // eject_animation_started?: number,
  gameObject: BrewManager
}

export class BrewManager {

  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  scene: Phaser.Scene;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,

    eject_anim_target_x: number,
    eject_anim_target_y: number,
  ) {
    this.scene = scene;
    this.sprite = this.scene.physics.add.sprite(x, y, "brew-can");
    this.sprite.setDisplaySize(7, 14)
    this.sprite.setDepth(this.sprite.y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2)

    this.EjectAnimate(eject_anim_target_x, eject_anim_target_y)
  }

  EjectAnimate(x: number, y: number) {
    this.scene.tweens.add({
      targets: this.sprite,
      x: { from: this.sprite.x, to: x, duration: 500, ease: 'Power1' },
      y: { from: this.sprite.y, to: y, duration: 500, ease: 'Sine.easeInOut' }
    })
  }

  MagnetMoveBrew(x: number, y: number) {
    this.scene.tweens.add({
      targets: this.sprite,
      x: { from: this.sprite.x, to: x, duration: 500, ease: 'Power1' },
      y: { from: this.sprite.y, to: y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 4, duration: 500, ease: 'Power1' }
    }).once("complete", () => {
      this.sprite.destroy()
    })
  }
}