import * as PIXI from "pixi.js";

import { STANDING, FLYING_TOWARDS_TARGET } from "../actions/batActions";
import anims from "./animStates";

export default (app, container) => {
  return new Promise((res) => {
    app.loader.add("bat.json").load((loader, resources) => {
      const sheet = resources["bat.json"];

      const { addAnim, run, animsState } = anims(sheet, container);

      const batStanding = addAnim("bat_flying", STANDING);
      batStanding.animationSpeed = 0.15;
      batStanding.boundingBox = new PIXI.Graphics();
      batStanding.boundingBox.visible = false;
      batStanding.boundingBox.lineStyle(1, 0xff0000);
      batStanding.boundingBox.drawRect(3, 1, 10, 15);
      setMiddleBottomPivot(batStanding);
      setMiddleBottomPivot(batStanding.boundingBox, batStanding);

      const batFlying = addAnim("bat_flying", FLYING_TOWARDS_TARGET);
      batStanding.animationSpeed = 0.15;
      batStanding.boundingBox = new PIXI.Graphics();
      batStanding.boundingBox.visible = false;
      batStanding.boundingBox.lineStyle(1, 0xff0000);
      batStanding.boundingBox.drawRect(3, 1, 10, 15);
      setMiddleBottomPivot(batStanding);
      setMiddleBottomPivot(batStanding.boundingBox, batStanding);

      const result = {
        anims,
        stand: () => {
          return run(batStanding);
        },
        flyTowardsTarget: () => {
          return run(batFlying);
        },
      };

      res({ anims: result, animsState });
    });
  });
};

function setMiddleBottomPivot(set, ref) {
  set.pivot.set((ref || set).width / 2, 0);
}
