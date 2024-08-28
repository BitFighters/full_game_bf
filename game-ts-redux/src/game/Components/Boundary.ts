import { Point } from "./utils";





export default class Boundary {
  position: Point;
  width: number;
  height: number;
  constructor(position: Point, width: number, height: number) {
    this.position = position
    this.width = width
    this.height = height
  }
  // draw() {
  //   // ctx.fillStyle = 'red'
  //   ctx.fillStyle = 'rgba(255,0,0,0.5)'
  //   ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  // }
}

export class Rect {
  leftX: integer; 
  leftY: integer;
  width: integer;
  height: integer;
  constructor(leftX: integer, leftY: integer, width: integer, height: integer) {
    this.leftX  = leftX
    this.leftY = leftY
    this.width = width
    this.height = height
  }
}

export function calculateRect(map: Phaser.Tilemaps.Tilemap, arena1_area: Phaser.Tilemaps.TilemapLayer) {
  // 1053.0813520135102 416.28495201354303
  console.log("--***------fightMachineOverLapArea ",map.widthInPixels, map.heightInPixels, arena1_area.hasTileAtWorldXY(1052,416))
  let minX = 99999;
  let minY = 99999;
  let maxX = -99999;
  let maxY = -99999
  for (let i = 0 ;i < map.heightInPixels; i++) {
    for (let j = 0; j < map.widthInPixels; j++) {
      if (arena1_area.hasTileAtWorldXY(j,i)) {
      // if (arena1_area.layer.data.findIndex) {
        if (i <= minX) minX = i;
        if (j <= minY) minY = j;
        if (i >= maxX) maxX = i;
        if (j >= maxY) maxY = j;
      }
    }
  }
  // console.log(minX, maxX, minY, maxY)
  const rect = new Rect(minX, minY, maxX - minX, maxY - minY)
  console.log("rect---",rect)
  return rect
}

export function calculateRectReverse(map: Phaser.Tilemaps.Tilemap, arena1_area: Phaser.Tilemaps.TilemapLayer) {
  // console.log("--***------radiator rect " )
  let minX = 99999;
  let minY = 99999;
  let maxX = -99999;
  let maxY = -99999
  for (let i = 0 ;i < map.heightInPixels; i++) {
    for (let j = 0; j < map.widthInPixels; j++) {
      if (arena1_area.hasTileAtWorldXY(j,i)) {
        if (j <= minX) minX = j;
        if (i <= minY) minY = i;
        if (j >= maxX) maxX = j;
        if (i >= maxY) maxY = i;
      }
    }
  }
  // console.log(minX, maxX, minY, maxY)
  const rect = new Rect(minX, minY, maxX - minX, maxY - minY)
  // console.log("--***------radiator rect ",rect)
  return rect
}