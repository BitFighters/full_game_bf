import Phaser from 'phaser'
import { isNullOrUndefined } from 'util'

export const createOtherCharacterAnimsV2 = (anims: Phaser.Animations.AnimationManager, key: string) => {
  if (isNullOrUndefined(key) || key === "") return;
  console.log("in createOtherCharacterAnimsV2 ", key)

  // idle
  anims.create({
    key: 'idle-'+ key,
    frames:[
      {
        key,
        frame: 'idle000.png'
      },
      {
        key,
        frame: 'idle001.png'
      },
    ],
    duration:600,
    repeat: -1
  })

  // idle brew
  anims.create({
    key: 'idleBrew-'+ key,
    frames:[
      {
        key,
        frame: 'idleBrew000.png'
      },
      {
        key,
        frame: 'idleBrew001.png'
      },
    ],
    duration:600,
    repeat: -1
  })

  // walk
  anims.create({
    key: 'walk-'+ key,
    frames: [{
        key,
        frame: 'walk000.png'
      },
      {
        key,
        frame: 'walk001.png'
      },
      {
        key,
        frame: 'walk002.png'
      },
    ],
    frameRate: 6,
    repeat: -1
  })

  // walk brew
  anims.create({
    key: 'walkBrew-'+ key,
    frames: [{
        key,
        frame: 'walkBrew000.png'
      },
      {
        key,
        frame: 'walkBrew001.png'
      },
      {
        key,
        frame: 'walkBrew002.png'
      },
    ],
    frameRate: 6,
    repeat: -1
  })

  // run
  anims.create({
    key: 'run-'+ key,
    frames: [{
        key,
        frame: 'walk000.png'
      },
      {
        key,
        frame: 'run000.png'
      },
      {
        key,
        frame: 'walk002.png'
      },
    ],
    frameRate: 10,
    repeat: 0
  })

  // run nrew
  anims.create({
    key: 'runBrew-'+ key,
    frames: [{
        key,
        frame: 'walkBrew000.png'
      },
      {
        key,
        frame: 'walkBrew001.png'
      },
      {
        key,
        frame: 'walkBrew002.png'
      },
    ],
    frameRate: 10,
    repeat: 0
  })

  // equipBrew nrew
  anims.create({
    key: 'equipBrew-'+ key,
    frames: [{
        key,
        frame: 'equipBrew000.png'
      },
      {
        key,
        frame: 'equipBrew001.png'
      },
    ],
    duration: 500,
    repeat: 0
  })

  // kick
  anims.create({
    key: 'kick-'+ key,
    frames: [{
        key,
        frame: 'kick000.png'
      },
      {
        key,
        frame: 'kick001.png'
      },
      {
        key,
        frame: 'kick002.png'
      },
    ],
    // frameRate: 8,
    duration: 400,
    repeat: 0
  })

  // punch
  anims.create({
    key: 'punch-'+ key,
    frames: [{
        key,
        frame: 'punch000.png'
      },
      {
        key,
        frame: 'punch001.png'
      },
      {
        key,
        frame: 'punch002.png'
      },
      {
        key,
        frame: 'punch002.png'
      },
      {
        key,
        frame: 'punch002.png'
      },
    ],
    duration: 200,
    // frameRate: 16,
    repeat: 0
  })

  // punch brew
  anims.create({
    key: 'punchBrew-'+ key,
    frames: [{
        key,
        frame: 'punchBrew000.png'
      },
      {
        key,
        frame: 'punchBrew001.png'
      },
      {
        key,
        frame: 'punchBrew002.png'
      },
      {
        key,
        frame: 'punchBrew002.png'
      },
      {
        key,
        frame: 'punchBrew002.png'
      },
    ],
    duration: 200,
    repeat: 0
  })

  // stunned
  anims.create({
    key: 'stunned-'+ key,
    frames: [{
        key,
        frame: 'stunned000.png'
      },
      {
        key,
        frame: 'stunned001.png'
      },
    ],
    // duration: 400,
    frameRate: 4,
    repeat: -1,
  })

  // front hit
  anims.create({
    key: 'gotHit-'+ key,
    frames: [{
        key,
        frame: 'front_hit000.png'
      },
      {
        key,
        frame: 'front_hit001.png'
      },
      {
        key,
        frame: 'front_hit002.png'
      },
    ],
    duration: 200,
    repeat: 0
  })

  // back hit
  anims.create({
    key: 'gotBackHit-'+ key,
    frames: [{
        key,
        frame: 'backHit000.png'
      },
      {
        key,
        frame: 'backHit001.png'
      },
      {
        key,
        frame: 'backHit002.png'
      },
    ],
    duration: 200,
    repeat: 0
  })

  // win
  anims.create({
    key: 'win-'+ key,
    frames: [{
        key,
        frame: 'win000.png'
      },
      {
        key,
        frame: 'win001.png'
      },
    ],
    duration: 600,
    repeat: 10
  })

  // lose
  anims.create({
    key: 'lose-'+ key,
    frames: [{
        key,
        frame: 'lose000.png'
      },
      {
        key,
        frame: 'lose001.png'
      },
    ],
    duration: 600,
    repeat: 10
  })

  // drink
  anims.create({
    key: 'drink-'+ key,
    frames: [
      {
        key,
        frame: 'drink005.png'
      },
      {
        key,
        frame: 'drink000.png'
      },
      {
        key,
        frame: 'drink000.png'
      },
      {
        key,
        frame: 'drink000.png'
      },
      {
        key,
        frame: 'drink001.png'
      },
      {
        key,
        frame: 'drink002.png'
      },
      {
        key,
        frame: 'drink003.png'
      },
      {
        key,
        frame: 'drink003.png'
      },
      {
        key,
        frame: 'drink003.png'
      },
    ],
    duration: 1500,
    repeat: 0
  })

  anims.create({
    key: 'drink2-'+ key,
    frames: [{
        key,
        frame: 'drink000.png'
      },
      {
        key,
        frame: 'drink001.png'
      },
      {
        key,
        frame: 'drink002.png'
      },
      {
        key,
        frame: 'drink003.png'
      },
            {
        key,
        frame: 'drink004.png'
      },
      {
        key,
        frame: 'drink004.png'
      },
      {
        key,
        frame: 'drink004.png'
      },
      // {
      //   key,
      //   frame: 'burp000.png'
      // },
      // {
      //   key,
      //   frame: 'burp000.png'
      // },
      // {
      //   key,
      //   frame: 'burp000.png'
      // },
      // {
      //   key,
      //   frame: 'burp000.png'
      // },
    ],
    duration: 2900,
    repeat: 0
  })

  // burp
  anims.create({
    key: 'burp-'+ key,
    frames: [
      {
        key,
        frame: 'drink004.png'
      },
      {
        key,
        frame: 'drink004.png'
      },
      {
        key,
        frame: 'drink004.png'
      },
      // {
      //   key,
      //   frame: 'burp000.png'
      // },
      // {
      //   key,
      //   frame: 'burp000.png'
      // },
      // {
      //   key,
      //   frame: 'burp000.png'
      // },
      // {
      //   key,
      //   frame: 'burp000.png'
      // },
    ],
    duration: 1000,
    repeat: 0
  })

  anims.create({
    key: 'dead-'+ key,
    frames: [{
        key,
        frame: 'TKO000.png'
      },
    ],
    frameRate: 1,
    repeat: -1
  })

  anims.create({
    key: 'brew-dropped-'+ key,
    frames: [{
        key,
        frame: 'dropBrew000.png'
      },
    ],
    duration: 500,
    repeat: 0
  })

  // front_gassed_lift_off_fall
  anims.create({
    key: 'front_gassed_lift_off_fall-'+ key,
    frames: [{
        key,
        frame: 'front_hit000.png'
      },
      {
        key,
        frame: 'front_hit001.png'
      },
      {
        key,
        frame: 'front_hit002.png'
      },
      {
        key,
        frame: 'lift000.png'
      },
      {
        key,
        frame: 'lift000.png'
      },
      {
        key,
        frame: 'lift001.png'
      },
       {
        key,
        frame: 'lift001.png'
      },
      {
        key,
        frame: 'lift002.png'
      },
      {
        key,
        frame: 'lift002.png'
      },
      {
        key,
        frame: 'lift003.png'
      },
      {
        key,
        frame: 'lift003.png'
      },


      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },

      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },

      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },

      {
        key,
        frame: 'get_up000.png'
      },
      {
        key,
        frame: 'get_up000.png'
      },
      {
        key,
        frame: 'get_up001.png'
      },
      {
        key,
        frame: 'get_up001.png'
      },
      {
        key,
        frame: 'get_up002.png'
      },
      {
        key,
        frame: 'get_up002.png'
      },

      
    ],
    duration: 2000,
    repeat: 0
  })

  // fly as angel
  anims.create({
    key: 'fly_as_angel-'+ key,
    frames: [
      {
        key,
        frame: 'angel001.png'
      },
      {
        key,
        frame: 'angel002.png'
      },
    ],
    duration: 200,
    repeat: -1
  })

  // dying sequence
  anims.create({
    key: 'dying_total_sequqnce-'+ key,
    frames: [{
        key,
        frame: 'front_hit000.png'
      },
      {
        key,
        frame: 'front_hit001.png'
      },
      {
        key,
        frame: 'front_hit002.png'
      },
      {
        key,
        frame: 'lift000.png'
      },
      {
        key,
        frame: 'lift000.png'
      },
      {
        key,
        frame: 'lift001.png'
      },
       {
        key,
        frame: 'lift001.png'
      },
      {
        key,
        frame: 'lift002.png'
      },
      {
        key,
        frame: 'lift002.png'
      },
      {
        key,
        frame: 'lift003.png'
      },
      {
        key,
        frame: 'lift003.png'
      },


      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe000.png'
      },
      // {
      //   key,
      //   frame: 'fall_breathe000.png'
      // },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      // {
      //   key,
      //   frame: 'fall_breathe001.png'
      // },

      {
        key,
        frame: 'fall_breathe000.png'
      },
      {
        key,
        frame: 'fall_breathe000.png'
      },
      // {
      //   key,
      //   frame: 'fall_breathe000.png'
      // },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      {
        key,
        frame: 'fall_breathe001.png'
      },
      // {
      //   key,
      //   frame: 'fall_breathe001.png'
      // },

      // add destroy here
      {
        key,
        frame: 'destroy000.png'
      },
      {
        key,
        frame: 'destroy001.png'
      },
      {
        key,
        frame: 'destroy002.png'
      },
      {
        key,
        frame: 'destroy003.png'
      },
      {
        key,
        frame: 'destroy004.png'
      },
      {
        key,
        frame: 'destroy005.png'
      },

      {
        key,
        frame: 'angel000.png'
      },
      {
        key,
        frame: 'angel000.png'
      },
      {
        key,
        frame: 'angel000.png'
      },
    ],
    duration: 4000,
    repeat: 0
  })

}