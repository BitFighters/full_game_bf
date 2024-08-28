import Phaser from 'phaser'
import { isNullOrUndefined } from 'util'

export const createMomAnimations = (anims: Phaser.Animations.AnimationManager, key: string) => {
  // if (isNullOrUndefined(key) || key === "") return;
  // console.log("in createOtherCharacterAnimsV2 ", key)

  anims.create({
    key: 'mom-idle',
    frames:[
      {
        key,
        frame: 'tile000.png'
      },
    ],
    duration:600,
    repeat: -1
  })

  // door open
  anims.create({
    key: 'mom-door-open',
    frames:[
      {
        key,
        frame: 'tile000.png'
      },
      {
        key,
        frame: 'tile001.png'
      },

      {
        key,
        frame: 'tile002.png'
      },
      {
        key,
        frame: 'tile003.png'
      },

      {
        key,
        frame: 'tile004.png'
      },
      {
        key,
        frame: 'tile005.png'
      },

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
    ],
    duration:2000,
    repeat: 0
  })

  // spray-anim
  anims.create({
    key: 'mom-spray-anim',
    frames:[
      {
        key,
        frame: 'tile011.png'
      },
      {
        key,
        frame: 'tile012.png'
      },

      {
        key,
        frame: 'tile013.png'
      },
      {
        key,
        frame: 'tile014.png'
      },

      {
        key,
        frame: 'tile015.png'
      },
      {
        key,
        frame: 'tile016.png'
      },
    ],
    duration:2000,
    repeat: -1
  })

  // idle brew
  // anims.create({
  //   key: 'idleBrew-'+ key,
  //   frames:[
  //     {
  //       key,
  //       frame: 'idleBrew000.png'
  //     },
  //     {
  //       key,
  //       frame: 'idleBrew001.png'
  //     },
  //   ],
  //   duration:600,
  //   repeat: -1
  // })

  
}