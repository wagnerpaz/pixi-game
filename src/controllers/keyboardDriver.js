import keyboard from "./keyboard";

export default (controls) => {
  const kbArrowLeft = keyboard("ArrowLeft");
  kbArrowLeft.press = controls.left.press;
  kbArrowLeft.release = controls.left.release;

  const kbArrowRight = keyboard("ArrowRight");
  kbArrowRight.press = controls.right.press;
  kbArrowRight.release = controls.right.release;

  const kbArrowUp = keyboard("ArrowUp");
  kbArrowUp.press = controls.jump.press;
  kbArrowUp.release = controls.jump.release;

  const kbControl = keyboard("Control");
  kbControl.press = controls.attack.press;
  kbControl.release = controls.attack.release;
};
