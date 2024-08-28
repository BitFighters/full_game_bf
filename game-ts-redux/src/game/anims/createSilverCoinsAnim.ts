import Phaser from 'phaser'
import { isNullOrUndefined } from 'util'

export const createSilverCoinAnim = (anims: Phaser.Animations.AnimationManager, key: string) => {
  if (isNullOrUndefined(key) || key === "") return;

  anims.create({
    key: 'rotate',
    frames:[
      {
        key,
        frame: 'tile006.png'
      },
      {
        key,
        frame: 'tile007.png'
      },
      {
        key,
        frame: 'tile008.png'
      },
      {
        key,
        frame: 'tile009.png'
      },
      {
        key,
        frame: 'tile010.png'
      },
      {
        key,
        frame: 'tile011.png'
      },
    ],
    frameRate: 6,
    repeat: -1
  })
}
