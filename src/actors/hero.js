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
        hero.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
        hero.y = 4 * 16 / PIXI.settings.RESOLUTION;
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

        const updateBeforeCol = (delta) => {
            hero.vy += GRAVITY;
            const xu = hero.vx * delta;
            const yu = hero.vy * delta;
            
            hero.x += xu;
            hero.y += yu;
        };

        const updateAfterCol = () => {
            updateState(hero.vx, hero.vy);
        };

        res({actor: hero, updateBeforeCol, updateAfterCol});
    });
    return result;
};