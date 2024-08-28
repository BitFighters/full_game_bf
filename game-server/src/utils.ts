import { DEFAULT_SPRITE_DISPLAY_HEIGHT, DEFAULT_SPRITE_DISPLAY_WIDTH, DEFAULT_SPRITE_DISPLAY_WIDTH_1 } from "./constants/constants";
import { IKeysInfo } from "./interfaces";
import { isNullOrUndefined } from "util";


export function json2array(json) {
  if (isNullOrUndefined(json)) return [];
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(key + ":" + json[key]);
  });
  return result;
}

export function getSecondsDifference(timeInEpoch: number) {
  var date = new Date().getTime();
  return date - timeInEpoch;
}

export interface Point {
  x: number,
  y: number,
}

export default class Boundary {
  position: Point;
  width: number;
  height: number;
  constructor(position: Point, width: number, height: number) {
    this.position = position
    this.width = width
    this.height = height
  }
}

export function rectangularCollision(rectangle1: Boundary, rectangle2: Point) {
  // console.log("in rectangularCollision ", rectangle1, rectangle2 )
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.x &&
    (rectangle1.position.x <= rectangle2.x) &&
    (rectangle1.position.y + rectangle1.height >= rectangle2.y) &&
    (rectangle1.position.y <= rectangle2.y)
  )
}

export function rectangularCollisionWithRectange(rectangle1: Boundary, rectangle2: Boundary) {
  // console.log("in rectangularCollision ", rectangle1, rectangle2 )
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    (rectangle1.position.x <= rectangle2.position.x + rectangle2.width) &&
    (rectangle1.position.y + rectangle1.height >= rectangle2.position.y) &&
    (rectangle1.position.y <= rectangle2.position.y + rectangle2.height)
  )
}


// export function basicCollisionAndMovementPlayer(totalBoundaries: any[], tempPos: {x: number, y: number}, delta: number, keyInfo: IKeysInfo) {
//   // move and update pos
//   let normalizer = 0;
//   if (keyInfo.keyA.pressed) normalizer+=1;
//   if (keyInfo.keyD.pressed) normalizer+=1;
//   if (keyInfo.keyS.pressed) normalizer+=1;
//   if (keyInfo.keyW.pressed) normalizer+=1;
//   let speed = 1;
//   let evetMovement = "move";

//   if (keyInfo.keyA.double_pressed || keyInfo.keyD.double_pressed) {
//     speed = 2
//     evetMovement = "running"
//   } else {
//     speed = 1;
//   }
//   let velocity = speed;
//   if (normalizer > 1) {
//     velocity = speed / Math.sqrt(normalizer);
//   }
//   // console.log("velocity -- ", velocity)
//   let calculatedSpeed = 0.06 * delta * velocity;
//   if (keyInfo.keyA.pressed) {
//     let playerMoving = true;
//     for (var i =0 ; i < totalBoundaries.length ; i++) {
//       if (
//         rectangularCollision(totalBoundaries[i], {x: tempPos.x - velocity, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//         || rectangularCollision(totalBoundaries[i], {x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH_1/2 - 4 * velocity, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT /2 } )
//         || rectangularCollision(totalBoundaries[i], {x: tempPos.x + DEFAULT_SPRITE_DISPLAY_WIDTH_1/2 + velocity, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT /2 } )
//       ) {
//         playerMoving = false;
//         break;
//       }
//     }
//     if (playerMoving) tempPos.x -= calculatedSpeed;
//   } if (keyInfo.keyD.pressed) {
//     let playerMoving = true;
//     for (var i =0 ; i < totalBoundaries.length ; i++) {
//       if (
//         rectangularCollision(totalBoundaries[i], {x: tempPos.x + 4*velocity, y: tempPos.y + velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//         || rectangularCollision(totalBoundaries[i], {x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH_1/2 - velocity, y: tempPos.y  + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//         || rectangularCollision(totalBoundaries[i], {x: tempPos.x + DEFAULT_SPRITE_DISPLAY_WIDTH_1/2 + 4*velocity, y: tempPos.y  + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//       ) {
//         playerMoving = false;
//         break;
//       }
//     }
//     if (playerMoving) tempPos.x += calculatedSpeed;
//   } if (keyInfo.keyS.pressed) {
//     let playerMoving = true;
//     for (var i =0 ; i < totalBoundaries.length ; i++) {
//       if (
//         rectangularCollision(totalBoundaries[i], {x: tempPos.x, y: tempPos.y + 4*velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//         || rectangularCollision(totalBoundaries[i], {x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH_1/2, y: tempPos.y + velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//         || rectangularCollision(totalBoundaries[i], {x: tempPos.x + DEFAULT_SPRITE_DISPLAY_WIDTH_1/2, y: tempPos.y + velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//       ) {
//         playerMoving = false;
//         break;
//       }
//     }
//     if (playerMoving) tempPos.y += calculatedSpeed;
//   } if (keyInfo.keyW.pressed) {
//     let playerMoving = true;
//     for (let i = 0 ; i < totalBoundaries.length ; i++) {
//       if (
//         rectangularCollision(totalBoundaries[i], {x: tempPos.x, y: tempPos.y - 4*velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//         || rectangularCollision(totalBoundaries[i], {x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH_1/2, y: tempPos.y - velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//         || rectangularCollision(totalBoundaries[i], {x: tempPos.x + DEFAULT_SPRITE_DISPLAY_WIDTH_1/2, y: tempPos.y - velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT /2} )
//       ) {
//         playerMoving = false;
//         break;
//       }
//     }
//     if (playerMoving) tempPos.y -= calculatedSpeed;
//   }

//   return {
//     event: evetMovement,
//     pos: tempPos,
//   }
// }

export function basicCollisionAndMovementPlayerV2(totalBoundaries: any[], tempPos: { x: number, y: number }, delta: number, keyInfo: IKeysInfo) {
  // move and update pos
  let normalizer = 0;
  if (keyInfo.keyA.pressed) normalizer += 1;
  if (keyInfo.keyD.pressed) normalizer += 1;
  if (keyInfo.keyS.pressed) normalizer += 1;
  if (keyInfo.keyW.pressed) normalizer += 1;
  let speed = 1;
  let evetMovement = "move";

  if (keyInfo.keyA.double_pressed || keyInfo.keyD.double_pressed) {
    speed = 2
    evetMovement = "running"
  } else {
    speed = 1;
  }
  let velocity = speed;
  if (normalizer > 1) {
    velocity = speed / Math.sqrt(normalizer);
  }
  // console.log("velocity -- ", velocity)
  let calculatedSpeed = 0.05 * delta * velocity;
  if (keyInfo.keyA.pressed) {
    let playerMoving = true;
    for (var i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollision(totalBoundaries[i], { x: tempPos.x, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(totalBoundaries[i], { x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2 - 2 * velocity, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(totalBoundaries[i], { x: tempPos.x + DEFAULT_SPRITE_DISPLAY_WIDTH / 2, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
      ) {
        // console.log("collision on A")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x -= calculatedSpeed;
    }
  } if (keyInfo.keyD.pressed) {
    let playerMoving = true;
    for (var i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollision(totalBoundaries[i], { x: tempPos.x, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(totalBoundaries[i], { x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(totalBoundaries[i], { x: tempPos.x + DEFAULT_SPRITE_DISPLAY_WIDTH / 2 + 2 * velocity, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
      ) {
        // console.log("collision on D")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x += calculatedSpeed;
    }
  } if (keyInfo.keyS.pressed) {
    let playerMoving = true;
    for (var i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollision(totalBoundaries[i], { x: tempPos.x, y: tempPos.y + 2 * velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(totalBoundaries[i], { x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2, y: tempPos.y + 2 * velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(totalBoundaries[i], { x: tempPos.x + DEFAULT_SPRITE_DISPLAY_WIDTH / 2, y: tempPos.y + 2 * velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
      ) {
        // console.log("collision on S")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.y += calculatedSpeed;
    }
  } if (keyInfo.keyW.pressed) {
    let playerMoving = true;
    for (let i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollision(totalBoundaries[i], { x: tempPos.x, y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 2 * velocity })
        || rectangularCollision(totalBoundaries[i], { x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2, y: tempPos.y - 2 * velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
        || rectangularCollision(totalBoundaries[i], { x: tempPos.x + DEFAULT_SPRITE_DISPLAY_WIDTH / 2, y: tempPos.y - 2 * velocity + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 })
      ) {
        // console.log("collision on W ", totalBoundaries[i])
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.y -= calculatedSpeed;
    }
  }

  return {
    event: evetMovement,
    pos: tempPos,
  }
}

export function basicCollisionAndMovementPlayerV3(totalBoundaries: any[], tempPos: { x: number, y: number }, delta: number, keyInfo: IKeysInfo, walk_speed: number, run_speed: number) {
  // move and update pos
  // console.log("in basicCollisionAndMovementPlayerV3")
  let normalizer = 0;
  if (keyInfo.keyA.pressed) normalizer += 1;
  if (keyInfo.keyD.pressed) normalizer += 1;
  if (keyInfo.keyS.pressed) normalizer += 1;
  if (keyInfo.keyW.pressed) normalizer += 1;
  let speed = walk_speed;
  let evetMovement = "move";

  if (keyInfo.keyA.double_pressed || keyInfo.keyD.double_pressed) {
    speed = run_speed
    evetMovement = "running"
  }
  speed = 2 * speed;
  let velocity = speed;
  if (normalizer > 1) {
    velocity = speed / Math.sqrt(normalizer);
  }
  let playerRequiredBox = new Boundary(
    {
      x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2 + 20,
      y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 4,
    },
    (DEFAULT_SPRITE_DISPLAY_WIDTH - 30),
    2
  )

  let calculatedSpeed = 0.06 * delta * velocity;
  // console.log("velocity -- ", velocity, calculatedSpeed)
  if (keyInfo.keyA.pressed) {
    let playerMoving = true;
    for (var i = 0; i < totalBoundaries.length; i++) {
      let bdy = totalBoundaries[i]
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x - 3 * velocity,
            y: playerRequiredBox.position.y
          }
        })
      ) {
        // console.log("collision on A")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x -= calculatedSpeed;
    }
  } if (keyInfo.keyD.pressed) {
    let playerMoving = true;
    for (var i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x + 3 * velocity,
            y: playerRequiredBox.position.y
          }
        })
      ) {
        // console.log("collision on D")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x += calculatedSpeed;
    }
  } if (keyInfo.keyS.pressed) {
    let playerMoving = true;
    for (var i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x,
            y: playerRequiredBox.position.y + 3 * velocity
          }
        })
      ) {
        // console.log("collision on S")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.y += calculatedSpeed;
    }
  } if (keyInfo.keyW.pressed) {
    let playerMoving = true;
    for (let i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x,
            y: playerRequiredBox.position.y - 3 * velocity
          }
        })
      ) {
        // console.log("collision on W ", totalBoundaries[i])
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.y -= calculatedSpeed;
    }
  }

  return {
    event: evetMovement,
    pos: tempPos,
    calculatedSpeed,
  }
}

export function checkOnlyColissionWithBoundaries(totalBoundaries: any[], tempPos: { x: number, y: number }, toMoveByPixels = 0, toMoveDirection = "right") {
  if (toMoveByPixels < 5) {
    toMoveByPixels = 5;
  }
  if (toMoveByPixels > 10) {
    toMoveByPixels = 8;
  }
  let playerRequiredBox = new Boundary(
    {
      x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2 + 15,
      y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 4,
    },
    (DEFAULT_SPRITE_DISPLAY_WIDTH - 30),
    2
  )
  let playerMoving = true;
  if (toMoveDirection === "left") {
    for (let i = 0; i < totalBoundaries.length; i++) {
      // let bdy = totalBoundaries[i]
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x - toMoveByPixels,
            y: playerRequiredBox.position.y
          }
        })
      ) {
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x -= toMoveByPixels;
    }
  } else if (toMoveDirection == "right") {
    for (let i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x + toMoveByPixels,
            y: playerRequiredBox.position.y
          }
        })
      ) {
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x += toMoveByPixels;
    }
  }

  return {
    dummyCanMove: playerMoving,
    dummyPos: tempPos,
  }
}

export function checkOnlyColissionWithBoundariesMouse(totalBoundaries: any[], tempPos: { x: number, y: number }, toMoveByPixels: { dx: number, dy: number }, toMoveDirection = "right") {
  // if (toMoveByPixels < 5) {
  //   toMoveByPixels = 5;
  // }
  // if (toMoveByPixels > 10) {
  //   toMoveByPixels = 8;
  // }
  let playerRequiredBox = new Boundary(
    {
      x: tempPos.x - 20,
      y: tempPos.y + 10,
    },
    10,
    6
  )
  let playerMoving = true;
  if (toMoveDirection === "left") {
    for (let i = 0; i < totalBoundaries.length; i++) {
      // let bdy = totalBoundaries[i]
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x + toMoveByPixels.dx,
            y: playerRequiredBox.position.y + toMoveByPixels.dy
          }
        })
      ) {
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x += toMoveByPixels.dx;
    }
  } else if (toMoveDirection == "right") {
    for (let i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x + toMoveByPixels.dx,
            y: playerRequiredBox.position.y + toMoveByPixels.dy
          }
        })
      ) {
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x += toMoveByPixels.dx;
    }
  }

  return {
    dummyCanMove: playerMoving,
    dummyPos: tempPos,
  }
}


export function basicCollisionWithBoundaryAndPlayer(totalBoundaries: any[], tempPos: { x: number, y: number }, delta: number, keyInfo: IKeysInfo, p2Pos: { x: number, y: number }, walk_speed: number, run_speed: number) {
  // move and update pos
  // console.log("in basicCollisionWithBoundaryAndPlayer")
  let normalizer = 0;
  if (keyInfo.keyA.pressed) normalizer += 1;
  if (keyInfo.keyD.pressed) normalizer += 1;
  if (keyInfo.keyS.pressed) normalizer += 1;
  if (keyInfo.keyW.pressed) normalizer += 1;
  let speed = walk_speed;
  let evetMovement = "move";

  if (keyInfo.keyA.double_pressed || keyInfo.keyD.double_pressed) {
    speed = run_speed
    evetMovement = "running"
  }
  speed = 2 * speed;
  let velocity = speed;
  if (normalizer > 1) {
    velocity = speed / Math.sqrt(normalizer);
  }
  let playerRequiredBox = new Boundary(
    {
      x: tempPos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2 + 4,
      y: tempPos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 4,
    },
    (DEFAULT_SPRITE_DISPLAY_WIDTH - 10),
    2
  )

  let player2RequiredBox = new Boundary(
    {
      x: p2Pos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2 + 4,
      y: p2Pos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 5,
    },
    (DEFAULT_SPRITE_DISPLAY_WIDTH - 10),
    10
  )

  // console.log(playerRequiredBox.position, player2RequiredBox.position)

  let calculatedSpeed = 0.06 * delta * velocity;
  // console.log("velocity -- ", velocity, calculatedSpeed, playerRequiredBox.position.x - 2* velocity, player2RequiredBox.position.x)
  if (keyInfo.keyA.pressed) {
    let playerMoving = true;
    for (let i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x - 5 * velocity,
            y: playerRequiredBox.position.y
          }
        }) ||
        rectangularCollisionWithRectange(player2RequiredBox, {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x - 3 * velocity,
            y: playerRequiredBox.position.y
          }
        })
      ) {
        // console.log("collision on A")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x -= calculatedSpeed;
    }
  } if (keyInfo.keyD.pressed) {
    let playerMoving = true;
    for (let i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x + 5 * velocity,
            y: playerRequiredBox.position.y
          }
        }) ||
        rectangularCollisionWithRectange(player2RequiredBox, {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x + 3 * velocity,
            y: playerRequiredBox.position.y
          }
        })
      ) {
        // console.log("collision on D")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.x += calculatedSpeed;
    }
  } if (keyInfo.keyS.pressed) {
    let playerMoving = true;
    for (let i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x,
            y: playerRequiredBox.position.y + 3 * velocity
          }
        }) ||
        rectangularCollisionWithRectange(player2RequiredBox, {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x,
            y: playerRequiredBox.position.y + 3 * velocity
          }
        })
      ) {
        // console.log("collision on S")
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.y += calculatedSpeed;
    }
  } if (keyInfo.keyW.pressed) {
    let playerMoving = true;
    for (let i = 0; i < totalBoundaries.length; i++) {
      if (
        rectangularCollisionWithRectange(totalBoundaries[i], {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x,
            y: playerRequiredBox.position.y - 5 * velocity
          }
        }) ||
        rectangularCollisionWithRectange(player2RequiredBox, {
          ...playerRequiredBox, position: {
            x: playerRequiredBox.position.x,
            y: playerRequiredBox.position.y - 3 * velocity
          }
        })
      ) {
        // console.log("collision on W ", totalBoundaries[i])
        playerMoving = false;
        break;
      }
    }
    if (playerMoving) {
      tempPos.y -= calculatedSpeed;
    }
  }

  return {
    event: evetMovement,
    pos: tempPos,
    calculatedSpeed,
  }
}
