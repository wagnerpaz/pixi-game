import { ATTACKING, FALLING, MOVING_LEFT, MOVING_RIGHT, RISING, STANDING } from '../actions/heroActions';
import {ANIM_COMPLETED, ANIM_STOPED} from '../anims/heroAnim';

export default (callback) => {
    let standing = false;
    let movingLeft = false;
    let movingRight = false;
    let rising = false;
    let falling = false;
    let attacking = false;

    const controls = {left: {}, right: {}, jump: {}, attack: {}};

    controls.left.press = () => {
        movingLeft = true;
        standing = false;
        callback(MOVING_LEFT, rising || falling);
    };
    controls.left.release = () => {
        movingLeft = false;
        if(movingRight) {
            callback(MOVING_RIGHT, rising || falling);
        }
        else {
            standing = true;
            callback(STANDING, rising || falling);
        }
    }

    controls.right.press = () => {
        movingRight = true;
        standing = false;
        callback(MOVING_RIGHT, rising || falling);
    };
    controls.right.release = () => {
        movingRight = false;
        if(movingLeft) {
            callback(MOVING_LEFT, rising || falling);
        }
        else {
            standing = true;
            callback(STANDING, rising || falling);
        }
    };

    controls.jump.press = () => {
        if(!(rising || falling)) {
            rising = true;
            standing = false;
            callback(RISING);
        }
    };
    controls.jump.release = () => {
        rising = false;
    };

    controls.attack.press = () => {
        callback(ATTACKING);
        attacking = true;
    };

    controls.attack.release = () => {
        // attacking = false;
    };

    const updateState = (vx, vy, animsState) => {
        if(attacking) {
            console.log('a', animsState[ATTACKING]);
            if(animsState[ATTACKING] === ANIM_COMPLETED) {
                attacking = false;
                if(!(falling || rising )) {
                    standing = true;
                    callback(STANDING);
                }
            }
        }
        else {
            if(vy > 0 && !falling) {
                rising = false;
                falling = true;
                callback(FALLING);
            } else if (vy === 0) {
                if(falling || rising) {
                    if(movingLeft) {
                        callback(MOVING_LEFT);
                    }else if(movingRight) {
                        callback(MOVING_RIGHT);
                    }
                    else {
                        standing = true;
                        callback(STANDING);
                    }
                }
                rising = false;
                falling = false;
            }
            if((movingRight || movingLeft) && vx === 0) {
                if(!standing) {
                    standing = true;
                    callback(STANDING);
                }
            }
        }
    };

    return {controls, updateState};
};