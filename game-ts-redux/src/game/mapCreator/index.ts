// @ts-nocheck
import Boundary from "../Components/Boundary";

enum MapKeys {
  LOBBY_MAP = "map",
  HQ_MAP = "hq_base"
}

export class MapCreator {
  scene: Phaser.Scene;
  mapKey!: string;
  map!: Phaser.Tilemaps.Tilemap
  clubFrontLayer!: Phaser.Tilemaps.TilemapLayer;
  basicCollisionCoordinatesX: Array<number> = [];
  basicCollisionCoordinatesY: Array<number> = [];
  boundaries: Array<Boundary> = []

  constructor(
    scene: Phaser.Scene,
  ) {
    this.scene = scene;
  }

  createMap(key: string): Phaser.Tilemaps.Tilemap {
    let mapKey = ""
    if (key === "lobby") {
      mapKey = MapKeys.LOBBY_MAP
    } else if (key === "hq_map") {
      mapKey = MapKeys.HQ_MAP
    }
    this.mapKey = mapKey;
    this.map = this.scene.make.tilemap({
      key: mapKey,
      tileHeight: 16,
      tileWidth: 16
    })
    return this.map;
  }

  createLayersInMap() {
    if (this.mapKey === "map") {
      const tileset: Phaser.Tilemaps.Tileset = this.map.addTilesetImage('LobbyTown', "tiles", 16, 16, 0, 0);
      const club: Phaser.Tilemaps.Tileset = this.map.addTilesetImage('CLUB', "club1", 16, 16, 0, 0);
      const wall: Phaser.Tilemaps.Tileset = this.map.addTilesetImage('wall', "wall", 16, 16, 0, 0);

      const mapLayer = this.map.createLayer(0, [tileset, club, wall], 0, 0);
      const clubLayer = this.map.createLayer(1, [tileset, club, wall], 0, 0);
      const collisionLayer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(2, [tileset, club, wall], 0, 0);
      const clubFrontLayer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(3, [tileset, club, wall], 0, 0);
      this.clubFrontLayer = clubFrontLayer;

      collisionLayer.forEachTile(_tile => {
        // console.log(_tile);
        if (_tile.index !== -1) {
          for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
              this.basicCollisionCoordinatesX.push(_tile.x * 16 + i);
              this.basicCollisionCoordinatesY.push(_tile.y * 16 + j);
            }
          }

          this.boundaries.push(
            new Boundary({ x: _tile.x * 16, y: _tile.y * 16 }, 16, 16)
          )
        }
      })
      collisionLayer.setDepth(-100000);
    }
  }

}