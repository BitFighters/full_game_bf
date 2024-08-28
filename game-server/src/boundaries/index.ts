import { OUTER_BOUNDARY } from "./outer_boundary"
import { INNER_BOUNDARY } from "./stage_boundary"

let totalBoundaries = []

for (let i =0 ; i < INNER_BOUNDARY.length; i++) {
  totalBoundaries.push(INNER_BOUNDARY[i])
}

for ( let i = 0; i < OUTER_BOUNDARY.length; i++) {
  totalBoundaries.push(OUTER_BOUNDARY[i])
}

const stageX: number[] = []
const stageY: number[] = []

for (let i =0 ; i < INNER_BOUNDARY.length; i++) {
  stageX.push(INNER_BOUNDARY[i].position.x)
  stageY.push(INNER_BOUNDARY[i].position.y )
}

const minXStage = Math.min(...stageX)
const minYStage = Math.min(...stageY)

const maxXStage = Math.max(...stageX)
const maxYStage = Math.max(...stageY)


let center_of_stage = {
  x: Math.round((minXStage + maxXStage)/2),
  y: Math.round((minYStage + maxYStage)/2)
}

console.log("stage dimension... ", minXStage, minYStage, maxXStage, maxYStage, center_of_stage)

export {totalBoundaries, center_of_stage, INNER_BOUNDARY};