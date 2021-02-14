import { ATTACKING, FALLING, MOVING, MOVING_LEFT, MOVING_RIGHT, RISING, STANDING } from '../actions/heroActions';

export const ANIM_STOPED = 0;
export const ANIM_PLAYING = 1;
export const ANIM_COMPLETED = 2;

export default (PIXI, app, container) => {
    return new Promise(res => {
        app.loader.add('hero.json').load((loader, resources) => {
            const sheet = resources['hero.json'];

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
    
            const heroStanding = addAnim("hero_standing", STANDING);
            heroStanding.animationSpeed = 0.025;
            heroStanding.boundingBox = new PIXI.Graphics();
            heroStanding.boundingBox.visible = false;
            heroStanding.boundingBox.lineStyle(1, 0xFF0000);
            heroStanding.boundingBox.drawRect(3, 1, 10, 15);
            setMiddleBottomPivot(heroStanding);
            setMiddleBottomPivot(heroStanding.boundingBox, heroStanding);

            
            const heroWalking = addAnim("hero_walking", MOVING);
            heroWalking.animationSpeed = 0.1; 
            heroWalking.boundingBox = new PIXI.Graphics();
            heroWalking.boundingBox.visible = false;
            heroWalking.boundingBox.lineStyle(1, 0xFF0000);
            heroWalking.boundingBox.drawRect(3, 1, 10, 15);
            setMiddleBottomPivot(heroWalking);
            setMiddleBottomPivot(heroWalking.boundingBox, heroWalking);

            const heroRising = addAnim("hero_rising", RISING);
            heroRising.loop = false;
            heroRising.animationSpeed = 0.09;
            heroRising.boundingBox = new PIXI.Graphics();
            heroRising.boundingBox.visible = false;
            heroRising.boundingBox.lineStyle(1, 0xFF0000);
            heroRising.boundingBox.drawRect(3, 1, 10, 15);
            setMiddleBottomPivot(heroRising);
            setMiddleBottomPivot(heroRising.boundingBox, heroRising);

            const heroFalling = addAnim("hero_falling", FALLING);
            heroFalling.loop = false;
            heroFalling.animationSpeed = 0.09;
            heroFalling.boundingBox = new PIXI.Graphics();
            heroFalling.boundingBox.visible = false;
            heroFalling.boundingBox.lineStyle(1, 0xFF0000);
            heroFalling.boundingBox.drawRect(3, 1, 10, 15);
            setMiddleBottomPivot(heroFalling);
            setMiddleBottomPivot(heroFalling.boundingBox, heroFalling);

            const heroAttacking = addAnim("hero_attacking", ATTACKING);
            heroAttacking.loop = false;
            heroAttacking.animationSpeed = 0.4;
            heroAttacking.boundingBox = new PIXI.Graphics();
            heroAttacking.boundingBox.visible = false;
            heroAttacking.boundingBox.lineStyle(1, 0xFF0000);
            heroAttacking.boundingBox.drawRect(3, 1, 10, 15);
            heroAttacking.pivot.x = 9;
            heroAttacking.pivot.y = 0;
            heroAttacking.boundingBox.pivot.x = 9;
            heroAttacking.boundingBox.pivot.y = 0;
    
            const result = {
                anims,
                walk: () => {
                    return run(heroWalking);
                },
                stand: () => {
                    return run(heroStanding);
                },
                rise: () => {
                    return run(heroRising);
                },
                fall: () => {
                    return run(heroFalling);
                },
                attack: () => {
                    return run(heroAttacking);
                }
            }

            res({anims: result, animsState});
        });
    });
};

function setMiddleBottomPivot(set, ref) {
    set.pivot.set((ref||set).width / 2, 0);
}