import keyboard from "../controllers/keyboard";

export const STANDING = 0;
export const MOVING_LEFT = 1;
export const MOVING_RIGHT = 2;
export const RISING = 3;
export const FALLING = 4;

export default (callback) => {
    let standing = false;
    let movingLeft = false;
    let movingRight = false;
    let rising = false;
    let falling = false;

    const controls = {left: {}, right: {}, jump: {}};

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

    const updateState = (vx, vy) => {
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
    };

    return {controls, updateState};
};