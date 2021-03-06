import * as PIXI from "pixi.js";

import { GRAVITY } from "../index";
import {
  ATTACKING,
  FALLING,
  MOVING,
  MOVING_LEFT,
  MOVING_RIGHT,
  RISING,
  STANDING,
} from "../actions/heroActions";

import createHeroAnim from "../anims/heroAnim";
import HeroState from "../state/HeroActionsState";
import keyboardDriver from "../controllers/keyboardDriver";
import mobileDriver from "../controllers/mobileDriver";

export const VELOCITY_X = 1;
export const VELOCITY_Y = 2;

export default (app) => {
  const result = new Promise(async (res) => {
    const hero = new PIXI.Container();

    const {
      anims: heroAnim,
      animsState: heroAnimsState,
    } = await createHeroAnim(app, hero);

    hero.vx = 0;
    hero.vy = 0;
    heroAnim.stand();

    const { controls, updateState } = HeroState((action, param) => {
      if (action === MOVING_LEFT) {
        console.log("moving left");
        hero.vx = -VELOCITY_X;
        hero.scale.x = -1;
        if (!param) {
          heroAnim.walk();
        }
      } else if (action === MOVING_RIGHT) {
        console.log("moving right");
        hero.vx = VELOCITY_X;
        hero.scale.x = 1;
        if (!param) {
          heroAnim.walk();
        }
      }

      if (action === RISING) {
        console.log("rising");
        hero.vy = -VELOCITY_Y;
        heroAnim.rise();
      } else if (action === FALLING) {
        console.log("falling");
        heroAnim.fall();
      }

      if (action === ATTACKING) {
        console.log("attacking");
        if (!param) {
          hero.vx = 0;
        }
        heroAnim.attack();
      }

      if (action === STANDING) {
        console.log("standing");
        hero.vx = 0;
        if (!param) {
          heroAnim.stand();
        }
      }
    });

    keyboardDriver(controls);
    mobileDriver(controls);

    const updateBeforeColX = (delta) => {
      const xu = hero.vx * delta;
      hero.x += xu;
    };

    let diffY = 0;
    const updateBeforeColY = (delta) => {
      hero.vy += GRAVITY * delta;
      const yu = hero.vy * delta;
      hero.y += yu;
      diffY = hero.y;
    };

    const updateAfterCol = (delta, ceilled) => {
      diffY = hero.y - diffY;
      updateState(hero.vx, hero.vy, heroAnimsState, diffY < 0, ceilled);
    };

    hero.updateBeforeColX = updateBeforeColX;
    hero.updateBeforeColY = updateBeforeColY;
    hero.updateAfterCol = updateAfterCol;
    hero.VELOCITY_X = VELOCITY_X;
    hero.VELOCITY_Y = VELOCITY_Y;

    res({ actor: hero });
  });
  return result;
};
