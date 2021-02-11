import * as PIXI from 'pixi.js';

export default (PIXI, app, container) => {
    return new Promise(res => {
        app.loader.add('hero.json').load((loader, resources) => {
            const sheet = resources['hero.json'];
        
            const anims = [];
            const addAnim = (name) => {
                const anim = new PIXI.AnimatedSprite(sheet.spritesheet.animations[name]);
                anims.push(anim);
                return anim;
            };
            const invalidateAnims = (anim) => {
                anims.forEach(a => {
                    a.stop();
                    container.removeChildren();
                });
            };
            const validateAnim = (anim) => {
                anim.play();
                setAnchor(anim);
                setAnchor(anim.boundingBox, anim);
                container.addChild(anim);
                container.addChild(anim.boundingBox);
            };
            const run = (anim) => {
                invalidateAnims(anim);
                validateAnim(anim);
                return anim;
            }
    
            const heroStanding = addAnim("hero_standing");
            heroStanding.animationSpeed = 0.025;
            heroStanding.boundingBox = new PIXI.Graphics();
            heroStanding.boundingBox.visible = false;
            heroStanding.boundingBox.lineStyle(1, 0xFF0000);
            heroStanding.boundingBox.drawRect(3, 1, 10, 15);

            
            const heroWalking = addAnim("hero_walking");
            heroWalking.animationSpeed = 0.1; 
            heroWalking.boundingBox = new PIXI.Graphics();
            heroWalking.boundingBox.visible = false;
            heroWalking.boundingBox.lineStyle(1, 0xFF0000);
            heroWalking.boundingBox.drawRect(3, 1, 10, 15);
    
            const result = {
                anims,
                walk: () => {
                    return run(heroWalking);
                },
                stand: () => {
                    return run(heroStanding);
                }
            }

            res(result);
        });
    });
};

function setAnchor(set, ref) {
    set.pivot.set((ref||set).width / 2, 0);
}