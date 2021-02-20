import * as PIXI from 'pixi.js';

import {STANDING, FLYING_TOWARDS_TARGET} from '../actions/batActions';

import createBatAnim from '../anims/batAnim';
import batState from '../state/batActionState';

const VELOCITY_X = 0.2;
const VELOCITY_Y = 0.2;

export default (app, target) => {
    const result = new Promise(async res => {
        const bat = new PIXI.Container();

        const {anims: batAnim, animsState: batAnimsState} = await createBatAnim(app, bat);

        batAnim.stand();
        
        const {updateState} = batState(((action, param) => {
            if(action === STANDING) {
                batAnim.stand();
            }else if(acton === FLYING_TOWARDS_TARGET) {
                batAnim.flyTowardsTarget();
            }
        }));
    
        const updateBeforeColX = (delta) => {
            if(target.x < bat.x) {
                bat.vx = -VELOCITY_X * delta;
                bat.scale.x = 1;
            }
            else if(target.x > bat.x) {
                bat.vx = VELOCITY_X * delta;
                bat.scale.x = -1;
            }
            bat.x += bat.vx;
        };

        let diffY = 0;
        const updateBeforeColY = (delta) => {
            if(target.y < bat.y) {
                bat.vy = -VELOCITY_Y * delta;
            }
            else if(target.y > bat.y) {
                bat.vy = VELOCITY_Y * delta;
            }
            bat.y += bat.vy;
            diffY = bat.y;
        };

        const updateAfterCol = (delta, ceilled) => {
            diffY = bat.y - diffY;
            updateState(bat.vx, bat.vy, batAnimsState, diffY < 0, ceilled);
        };

        bat.updateBeforeColX = updateBeforeColX;
        bat.updateBeforeColY = updateBeforeColY;
        bat.updateAfterCol = updateAfterCol;
        bat.VELOCITY_X = VELOCITY_X;
        bat.VELOCITY_Y = VELOCITY_Y;

        res({actor: bat});
    });
    return result;
};