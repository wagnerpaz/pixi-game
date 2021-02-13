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
                    a.gotoAndStop(0);
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
            heroStanding.boundingBox.visible = true;
            heroStanding.boundingBox.lineStyle(1, 0xFF0000);
            heroStanding.boundingBox.drawRect(3, 1, 10, 15);

            
            const heroWalking = addAnim("hero_walking");
            heroWalking.animationSpeed = 0.1; 
            heroWalking.boundingBox = new PIXI.Graphics();
            heroWalking.boundingBox.visible = true;
            heroWalking.boundingBox.lineStyle(1, 0xFF0000);
            heroWalking.boundingBox.drawRect(3, 1, 10, 15);

            const heroRising = addAnim("hero_rising");
            heroRising.loop = false;
            heroRising.animationSpeed = 0.09;
            heroRising.boundingBox = new PIXI.Graphics();
            heroRising.boundingBox.visible = false;
            heroRising.boundingBox.lineStyle(1, 0xFF0000);
            heroRising.boundingBox.drawRect(3, 1, 10, 15);

            const heroFalling = addAnim("hero_falling");
            heroFalling.loop = false;
            heroFalling.animationSpeed = 0.09;
            heroFalling.boundingBox = new PIXI.Graphics();
            heroFalling.boundingBox.visible = false;
            heroFalling.boundingBox.lineStyle(1, 0xFF0000);
            heroFalling.boundingBox.drawRect(3, 1, 10, 15);
    
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
                }
            }

            res({anims: result});
        });
    });
};

function setAnchor(set, ref) {
    set.pivot.set((ref||set).width / 2, 0);
}