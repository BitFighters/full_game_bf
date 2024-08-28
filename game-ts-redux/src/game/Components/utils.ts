import Boundary from "./Boundary";

export interface Point {
  x: number,
  y: number,
}

export interface BoundaryConstructor {
  position : Point,
  width: number,
  height: number,
}


export interface IPlayer {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
}

export interface IAction {
  walking: boolean,
  kicking: boolean,
  punching: boolean,
  idle: boolean,
  kickStart: boolean,
  kickEnd: boolean,
  punchStart: boolean,
  running: boolean,
  runStart: boolean,
  gotHit: boolean,
  gotHitStart: boolean,
  gotBackHit: boolean;
  downAnimPlaying: boolean,
  showStunnedAnim: boolean,

  showDeadSprite: boolean,
}

export function rectangularCollision(rectangle1: Boundary, rectangle2: Point) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.x &&
    (rectangle1.position.x <= rectangle2.x) &&
    (rectangle1.position.y + rectangle1.height >= rectangle2.y) &&
    (rectangle1.position.y <= rectangle2.y)
  )
}