import Phaser from 'phaser'
import { isNullOrUndefined } from 'util'
export default class createRatsAnims extends Phaser.Scene {
  constructor() {
    super({ key: 'CreateRatsAnims' });
    console.log('createRatsAnims constructor')
    this.init();
  }

  init() {
   // console.log('createRatsAnims preload')
    // this.load.spritesheet("rat_sheet", "bitfgihter_assets/rat-sprite.png", {
    //   frameWidth: 936,
    //   frameHeight: 40
    // });
    this.anims.create({
      key:"idle",
      frames: this.anims.generateFrameNumbers("rat_sheet", { frames: [0,1]}),
      duration: 10000,
      repeat: -1
    })
    this.anims.create({
      key:"run",
      frames: this.anims.generateFrameNumbers("rat_sheet", { frames: [1,2,3,4,5,6,7]}),
      duration: 1000,
      repeat: 0
    })


    console.log('createRatsAnims create', this.anims)
  }
}
// export const createRatsAnims = (anims: Phaser.Animations.AnimationManager, key: string) => {
//   if (isNullOrUndefined(key) || key === "") return;
//   console.log("in ccreate mouse animation -- ", key, 'idle-' + key)

//   // const randomFrameRate = Phaser.Math.Between(1, 3);
//   anims.create({
//     key:"first_frame_idle",
//     frames: anims.generateFrameNumbers("mint_machine_open", { frames: [0]}),
//     duration: 10000,
//     repeat: -1
//   })

//   anims.create({
//     key: 'idle-' + key,
//     frames: [
//       {
//         key,
//         frame: 'idle000.png',
        
//       },
//       {
//         key,
//         frame: 'idle001.png',
//         duration: Phaser.Math.Between(200, 3000),
//       },
//     ],
//     frameRate: 3,
//     repeat: -1
//   });


//   anims.create({
//     key: 'run-start-' + key,
//     frames: [{
//       key,
//       frame: 'idle001.png'
//     },
//     {
//       key,
//       frame: 'run000.png'
//     },
//     ],
//     frameRate: 6,
//     repeat: 0
//   })

//   anims.create({
//     key: 'run-' + key,
//     frames: [{
//       key,
//       frame: 'run001.png'
//     },
//     {
//       key,
//       frame: 'run002.png'
//     },
//     ],
//     frameRate: 6,
//     repeat: -1
//   })

//   anims.create({
//     key: 'die-' + key,
//     frames: [{
//       key,
//       frame: 'die000.png'
//     },
//     ],
//     frameRate: 12,
//     repeat: -1
//   })

//   anims.create({
//     key: 'hurt-' + key,
//     frames: [
//       {
//         key,
//         frame: 'idle001.png'
//       },
//       {
//         key,
//         frame: 'hurt001.png'
//       },
//     ],
//     duration: 500,
//     repeat: 0
//   })
// }
