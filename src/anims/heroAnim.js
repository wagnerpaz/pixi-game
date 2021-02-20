import * as PIXI from 'pixi.js';

import { ATTACKING, FALLING, MOVING, RISING, STANDING } from '../actions/heroActions';
import anims from './animStates';

export default (app, container) => {
    return new Promise(res => {
        app.loader.add('hero.json').load((loader, resources) => {
            const sheet = resources['hero.json'];

            const {addAnim, run, animsState} = anims(sheet, container);
    
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