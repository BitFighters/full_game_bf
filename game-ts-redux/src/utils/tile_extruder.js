const { extrudeTilesetToImage } = require("tile-extruder");
console.log('building tile set')
async function main() {
  try {
    await extrudeTilesetToImage(
      16,
      16,
      "public/new_assets/map/HQ_Sprite_Sheet.png",
      "public/new_assets/map/HQ_Sprite_Sheet_Extruded.png"
    );
    console.log('HQ Tileset extruded successfully!');
  } catch (error) {
    console.error('Error extruding tileset:', error);
  }

  try {
    await extrudeTilesetToImage(
      16,
      16,
      "public/new_assets/map/xMas_Sprite_Sheet.png",
      "public/new_assets/map/xMas_Sprite_Sheet_Extruded.png"
    );
    console.log('xMas Tileset extruded successfully!');
  } catch (error) {
    console.error('Error extruding tileset:', error);
  }
}

main();

module.exports = {}; // This is to ensure the file is treated as a module


