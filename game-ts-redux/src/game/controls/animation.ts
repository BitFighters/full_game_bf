// @ts-nocheck
import store from "../../stores";
import { ShowDownSprite, ShowGotBacktHitSprite, ShowGotHitSprite } from "../../stores/UserActions";
import { IKeysInfo } from "../characters/IPlayer";
import { IAction } from "../Components/utils";

export const animateMovementv2 = (newSystemKeys: IKeysInfo, player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, actions: IAction, socket: any, animation_id: any, value: { playerMoved: boolean; orientation: string; }) => {
  actions.kickStart = false
  actions.kickEnd = false
  actions.punchStart = false
  actions.runStart = false
  actions.gotHitStart = false
  // actions.gotBackHit = false;
  // actions.gotHit = false;

  // var tempMover = false;
  // actions
  // console.log("double pressed.. ", actions.running, actions.runStart)
  // console.log("stunned--", 
  //   store.getState().userActionsDataStore.showStunnedSprite, 
  //   actions.showStunnedAnim, actions.gotHit, actions.gotBackHit, 
  //   player.anims.currentAnim.key === 'gotHit-' + animation_id,
  //   player.anims.currentAnim.key === 'gotBackHit-' + animation_id,
  //   store.getState().userActionsDataStore.showGotBackHitSprite,
  //   store.getState().userActionsDataStore.showGotHitSprite
  // )
  if (store.getState().userActionsDataStore.showGotHitSprite) {
    store.dispatch(ShowGotHitSprite(false));
    if (!actions.gotHit) {
      actions.running = false;
      actions.kicking = false;
      actions.punching = false;
      store.dispatch(ShowGotHitSprite(false));
      player.stop();
      player.play('gotHit-' + animation_id).once('animationcomplete', () => {
        console.log("animation finish got hit ..")
        actions.gotHit = false;
        if (store.getState().userActionsDataStore.showStunnedSprite) {
          player.play('stunned-' + animation_id)
          actions.showStunnedAnim = false;
        } else {
          player.play('idle-' + animation_id);
        }
      })
      actions.gotHit = true;
    }
  } else if (store.getState().userActionsDataStore.showGotBackHitSprite) {
    store.dispatch(ShowGotBacktHitSprite(false));
    if (!actions.gotBackHit) {
      actions.running = false;
      actions.kicking = false;
      actions.punching = false;
      store.dispatch(ShowGotBacktHitSprite(false));
      player.stop();
      player.play('gotBackHit-' + animation_id).once('animationcomplete', () => {
        console.log("animation finish got back hit ..")
        actions.gotBackHit = false;
        if (store.getState().userActionsDataStore.showStunnedSprite) {
          player.play('stunned-' + animation_id)
          actions.showStunnedAnim = false;
        } else {
          player.play('idle-' + animation_id);
        }
      })
      actions.gotBackHit = true;
    }
  } else if (store.getState().userActionsDataStore.showStunnedSprite) {
    if (!actions.showStunnedAnim) {
      actions.running = false;
      actions.kicking = false;
      actions.punching = false;
      console.log("showing stunned animation");
      player.stop();
      player.play('stunned-' + animation_id).once('animationcomplete', () => {
        console.log("animation finish stunned..")
        actions.showStunnedAnim = false;
      })
      actions.showStunnedAnim = true;
    }
  } else if (store.getState().userActionsDataStore.showDownSprite) {
    if (!actions.downAnimPlaying) {
      player.stop();
      player.play('lift-' + animation_id)
        // .on("animationupdate", () => {
        //   if (actions.downAnimPlaying) {
        //     // player.y -= ()
        //     if (value.orientation === "left") {
        //       player.x += 1;
        //     }
        //     else if (value.orientation === "right") {
        //       player.x -= 1;
        //     }
        //   }
        // })
        .once('animationcomplete', () => {
          console.log("animation finish lift..")
          player.play('falldown-' + animation_id)
            // .on("animationupdate", () => {
            //   if (actions.downAnimPlaying) {
            //     if (value.orientation === "left") {
            //       player.x += 1;
            //     }
            //     else if (value.orientation === "right") {
            //       player.x -= 1;
            //     }
            //   }
            // })
            .once('animationcomplete', () => {
              console.log("animation finish fall down")
              actions.downAnimPlaying = false;
              player.play('idle-' + animation_id);
            })
        })
      store.dispatch(ShowDownSprite(false))
      actions.downAnimPlaying = true;
    }
  } else if (store.getState().userActionsDataStore.showDeadSprite) {
    if (!actions.showDeadSprite) {
      player.stop();
      // player.play('lift-'+animation_id)
      // .once('animationcomplete', () => {
      console.log("animation finish lift..")
      player.play('dead-' + animation_id)
        .once('animationcomplete', () => {
          // dead //
        })
      // })
      actions.showDeadSprite = true;
    }
  }
  else if (newSystemKeys.keyD.double_pressed || newSystemKeys.keyA.double_pressed) {
    if (!actions.running && !actions.showStunnedAnim) {
      player.stop();
      socket.send(JSON.stringify({
        event: "running",
        walletAddress: store.getState().web3store.userAddress,
      }))
      player.play('run-' + animation_id).once('animationcomplete', () => {
        // console.log("animation finish running ..")
        actions.running = false;
        actions.runStart = true;
        player.play('idle-' + animation_id);
      })
      actions.running = true;
      actions.runStart = true;
    }
  }
  else if (newSystemKeys.keyK.pressed) {
    if (!actions.kicking && !actions.showStunnedAnim && !actions.punching) {
      player.stop();
      player.play('kick-' + animation_id).once('animationcomplete', () => {
        console.log("animation finished kick")
        player.play('idle-' + animation_id);
        actions.kickEnd = true;
        setTimeout(() => {
          actions.kicking = false;
          actions.kickStart = true;
        }, 200)
      })
      actions.kicking = true;
      actions.kickStart = true;
    }
  }
  else if (newSystemKeys.keyP.pressed) {
    if (!actions.punching && !actions.showStunnedAnim && !actions.kicking) {
      player.stop();
      player.play('punch-' + animation_id).once('animationcomplete', () => {
        player.play('idle-' + animation_id);
        // console.log("animation finished punch")
        setTimeout(() => {
          actions.punching = false;
          actions.punchStart = true;
        }, 100)
      })
      actions.punching = true;
      actions.punchStart = true;
    }
  } else if (
    newSystemKeys.keyA.pressed
    || newSystemKeys.keyS.pressed
    || newSystemKeys.keyD.pressed
    || newSystemKeys.keyW.pressed
  ) {
    if ((player.anims.currentAnim.key !== 'walk-' + animation_id)
      && !actions.kicking
      && !actions.punching
      && !actions.running
      && !actions.downAnimPlaying
      && !actions.showStunnedAnim
      && !actions.showDeadSprite
      && player.anims.currentAnim.key !== 'gotHit-' + animation_id
      && player.anims.currentAnim.key !== 'gotBackHit-' + animation_id
    ) {
      actions.gotBackHit = false;
      actions.gotHit = false;
      player.stop()
      player.play('walk-' + animation_id)
    }
  } else {
    if (!actions.kicking && !actions.punching && !actions.running && !actions.showDeadSprite && !actions.gotHit && !actions.downAnimPlaying && !actions.gotBackHit && !actions.showStunnedAnim) {
      player.stop();
      player.play('idle-' + animation_id);
    }
  }
  return actions;
};
