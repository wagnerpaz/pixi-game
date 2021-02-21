import { CompositeRectTileLayer } from "pixi-tilemap/dist/pixi-tilemap";

import caveTilemap from "../cave-8.json";

export default (app) => {
  const result = new Promise((res) => {
    app.loader
      .add("cave-8_1.png")
      .add("cave-8_2.png")
      .add("cave-8_3.png")
      .add("cave-8_4.png")
      .load((loader, resources) => {
        const tilemap = new CompositeRectTileLayer(0, resources);

        const collidables = [];

        var size = caveTilemap.tileheight;
        // bah, im too lazy, i just want to specify filenames from atlas
        for (var i = 0; i < caveTilemap.tileswide; i++) {
          for (var j = 0; j < caveTilemap.tileshigh; j++) {
            const tile = caveTilemap.layers[0].tiles.find(
              (t) => t.x === i && t.y === j
            );
            if (tile.tile !== -1 && tile.tile !== 0) {
              const texture = resources[`cave-8_${tile.tile}.png`].texture;

              let rot;
              switch (tile.rot) {
                case 1:
                  rot = 6;
                  break;
                case 2:
                  rot = 4;
                  break;
                case 3:
                  rot = 2;
                  break;
              }
              if (tile.flipX) {
                rot = 12;
              }
              texture.rotate = rot;

              tilemap.addFrame(texture, i * size, j * size);

              const collisionBox = {
                x: i * size,
                y: j * size,
                width: size,
                height: size,
              };
              collidables.push(collisionBox);
            }
          }
        }

        res({ collidables, tilemap });
      });
  });

  return result;
};
