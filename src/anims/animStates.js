export const ANIM_STOPED = 0;
export const ANIM_PLAYING = 1;
export const ANIM_COMPLETED = 2;

export default (sheet, container) => {
    const animsState = {};
    const anims = [];

    const addAnim = (name, action) => {
        const anim = new PIXI.AnimatedSprite(sheet.spritesheet.animations[name]);
        anim.action = action;
        anims.push(anim);
        return anim;
    };
    const invalidateAnims = (anim) => {
        anims.forEach(a => {
            a.stop();
            a.gotoAndStop(0);
            container.removeChildren();
            animsState[anim.action] = ANIM_STOPED;
        });
    };
    const validateAnim = (anim) => {
        anim.play();
        container.addChild(anim);
        container.addChild(anim.boundingBox);
    };
    const run = (anim, onComplete) => {
        invalidateAnims(anim);
        validateAnim(anim);

        animsState[anim.action] = ANIM_PLAYING;
        anim.onComplete = () => {
            animsState[anim.action] = ANIM_COMPLETED;
        };
        return {onComplete};
    }

    return {addAnim, run, anims, animsState};
};