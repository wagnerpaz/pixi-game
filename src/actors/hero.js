import * as PIXI from 'pixi.js';

import {GRAVITY, VELOCITY_X, VELOCITY_Y} from '../index';

import createHeroAnim from '../anims/heroAnim';
import HeroState, { FALLING, MOVING_LEFT, MOVING_RIGHT, RISING, STANDING } from '../state/HeroActionsState';
import keyboardDriver from '../controllers/keyboardDriver';
import mobileDriver from '../controllers/mobileDriver';

export default (app) => {
    const result = new Promise(async res => {
        const hero = new PIXI.Container();

        const {anims: heroAnim} = await createHeroAnim(PIXI, app, hero);

        hero.vx = 0;
        hero.vy = 0;
        hero.x = 100;
        hero.y = 100;
        heroAnim.stand();
        
        const {controls, updateState} = HeroState(((action, param) => {
            if(action === MOVING_LEFT) {
                console.log('moving left');
                hero.vx = -VELOCITY_X;
                hero.scale.x = -1;
                if(!param) {
                    heroAnim.walk();
                }
            } else if (action === MOVING_RIGHT) {
                console.log('moving right');
                hero.vx = VELOCITY_X;
                hero.scale.x = 1;
                if(!param) {
                    heroAnim.walk();
                }
            }
    
            if(action === RISING) {
                console.log('rising');
                hero.vy = -VELOCITY_Y;
                heroAnim.rise();
    
            } else if(action === FALLING) {
                console.log('falling');
                heroAnim.fall();
            }
    
            if(action === STANDING) {
                console.log('standing');
                hero.vx = 0;
                if(!param) {
                    heroAnim.stand();
                }
            }
        }));
    
        keyboardDriver(controls);
        mobileDriver(controls);

        const updateBeforeColX = (delta) => {
            const xu = hero.vx * delta;
            hero.x += xu;
        };

        const updateBeforeColY = (delta) => {
            hero.vy += GRAVITY;
            const yu = hero.vy * delta;
            hero.y += yu;
        };

        const updateAfterCol = () => {
            updateState(hero.vx, hero.vy);
        };

        res({actor: hero, updateBeforeColX, updateBeforeColY, updateAfterCol});
    });
    return result;
};