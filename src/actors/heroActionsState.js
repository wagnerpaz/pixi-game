import {
  ATTACKING,
  FALLING,
  MOVING_LEFT,
  MOVING_RIGHT,
  RISING,
  STANDING,
} from "../actions/heroActions";
import { ANIM_COMPLETED } from "../anims/animStates";

export default (callback) => {
  let moveLeftPressed = false;
  let moveRightPressed = false;
  let jumpPressed = false;
  let attackPressed = false;

  let standing = false;
  let onGround = false;
  let onCeil = false;
  let movingLeft = false;
  let movingRight = false;
  let rising = false;
  let falling = false;
  let attacking = false;

  const controls = { left: {}, right: {}, jump: {}, attack: {} };

  controls.left.press = () => {
    standing = false;
    moveLeftPressed = true;
    movingLeft = true;
    movingRight = false;
    if (attacking) return;
    callback(MOVING_LEFT, falling || rising);
  };
  controls.left.release = () => {
    moveLeftPressed = false;
    movingLeft = false;
    if (moveRightPressed) {
      controls.right.press();
    }
  };

  controls.right.press = () => {
    standing = false;
    moveRightPressed = true;
    movingRight = true;
    movingLeft = false;
    if (attacking) return;
    callback(MOVING_RIGHT, falling || rising);
  };
  controls.right.release = () => {
    moveRightPressed = false;
    movingRight = false;
    if (moveLeftPressed) {
      controls.left.press();
    }
  };

  controls.jump.press = () => {
    jumpPressed = true;
    if (!(rising || falling) && onGround && !onCeil && !attacking) {
      rising = true;
      callback(RISING);
    }
  };
  controls.jump.release = () => {
    jumpPressed = false;
  };

  controls.attack.press = () => {
    if (!attacking) {
      standing = false;
      attackPressed = true;
      attacking = true;
      callback(ATTACKING, falling || rising);
    }
  };

  controls.attack.release = () => {
    attackPressed = false;
  };

  const stand = () => {
    if (!standing) {
      standing = true;
      callback(STANDING);
    }
  };

  const updateState = (vx, vy, animsState, grounded, ceilled) => {
    onGround = grounded;
    onCeil = ceilled;

    if (attacking) {
      if (animsState[ATTACKING] === ANIM_COMPLETED) {
        console.log("a", animsState[ATTACKING]);
        attacking = false;
        if (movingLeft) {
          controls.left.press();
        } else if (movingRight) {
          controls.right.press();
        } else {
          stand();
        }
      }
    } else {
      if (!movingRight && !movingLeft && !falling && !rising) {
        stand();
      }

      if (vy > 0) {
        if (!falling) {
          standing = false;
          rising = false;
          falling = true;
          callback(FALLING);
        }
      } else if (vy === 0 && (falling || rising)) {
        rising = false;
        falling = false;

        if (movingLeft) {
          controls.left.press();
        } else if (movingRight) {
          controls.right.press();
        } else {
          stand();
        }
      }

      if (jumpPressed && !falling && !rising) {
        controls.jump.press();
      }
    }
  };

  return { controls, updateState };
};
