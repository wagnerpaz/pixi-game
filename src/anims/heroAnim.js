import * as PIXI from 'pixi.js';

export default (app) => {
    return new Promise(res => {
        app.loader.add('hero.json').load((loader, resources) => {
            const sheet = resources['hero.json'];
        
            const anims = [];
            const addAnim = (name) => {
                const anim = new PIXI.AnimatedSprite(sheet.spritesheet.animations[name]);
                setAnchor(anim);
                anim.renderable = false;
                anims.push(anim);
                return anim;
            };
            const invalidateAnims = () => {
                anims.forEach(a => {
                    a.stop();
                    a.renderable = false;
                });
            };
            const validateAnim = (anim) => {
                anim.play();
                anim.renderable = true;
            };
            const run = (anim) => {
                invalidateAnims();
                validateAnim(anim);
            }
    
            const heroStanding = addAnim("hero_standing");
            heroStanding.animationSpeed = 0.025;
            
            const heroWalking = addAnim("hero_walking");
            heroWalking.animationSpeed = 0.1; 
    
            const result = {
                anims,
                walk: () => {
                    run(heroWalking);
                },
                stand: () => {
                    run(heroStanding);
                }
            }

            res(result);
        });
    });
};

function setAnchor(sprite) {
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
}