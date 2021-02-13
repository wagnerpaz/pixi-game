import Bump from 'bump.js';
import SAT from 'sat';

import * as PIXI from 'pixi.js';
import {CompositeRectTileLayer} from 'pixi-tilemap/dist/pixi-tilemap';

import caveTilemap from './cave.json';

import heroAnim from './anims/heroAnim';
import HeroState, { FALLING, MOVING_LEFT, MOVING_RIGHT, RISING, STANDING } from './state/HeroActionsState';
import keyboardDriver from './controllers/keyboardDriver';
import mobileDriver from './controllers/mobileDriver';

const GRAVITY = 0.098;
const VELOCITY_X = 1;
const VELOCITY_Y = 3;

PIXI.settings.RESOLUTION = 2;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const b = new Bump(PIXI);

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({transparent: true});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.view.style.backgroundColor = "#888";

window.onresize = function()
{
    app.renderer.resize(window.innerWidth / PIXI.settings.RESOLUTION, window.innerHeight / PIXI.settings.RESOLUTION);
}
window.onresize();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

const hero = new PIXI.Container();

app.loader.add('cave_0.png').add('cave_1.png').add('cave_2.png').add('cave_3.png').add('cave_4.png').load((loader, resources) => {
    const tilemap = new CompositeRectTileLayer(0, [resources['cave_3.png'].texture]);

    const colidables = [];

    var size = caveTilemap.tileheight;
    // bah, im too lazy, i just want to specify filenames from atlas
    for (var i=0; i < caveTilemap.tileswide; i++) {
        for (var j=0; j< caveTilemap.tileshigh; j++) {
            const tile = caveTilemap.layers[0].tiles.find(t => t.x === i && t.y === j);
            if(tile.tile !== -1 && tile.tile !== 0) {
                const oldTexture = resources[`cave_${tile.tile}.png`].texture;
                
                let rot;
                switch(tile.rot) {
                    case 1: rot = 6; break;
                    case 2: rot = 4; break;
                    case 3: rot = 2; break;
                }
                if(tile.flipX) {
                    rot = 12;
                }
                const newTexture = new PIXI.Texture(oldTexture, oldTexture.frame, oldTexture.orig, oldTexture.trim, rot);

                tilemap.addFrame(newTexture, i*size, j*size);

                colidables.push({x: i * size, y: j * size, width: size, height: size});
            }
        }
    }

    app.stage.addChild(tilemap);

    console.log('tilemap', tilemap);
    console.log(colidables);


heroAnim(PIXI, app, hero).then(heroAnim => {
    // const colidables = [];
    // const floor = new PIXI.Graphics();
    // floor.beginFill(0x00FF00);
    // floor.drawRect(0, 0, app.view.width / 1.5 / PIXI.settings.RESOLUTION, app.view.height/ 1.5 / PIXI.settings.RESOLUTION);
    // floor.endFill();
    // floor.x = 0;
    // floor.y = app.renderer.height / 1.5 / PIXI.settings.RESOLUTION;
    // app.stage.addChild(floor);
    // colidables.push(floor);

    // const wall1 = new PIXI.Graphics();
    // wall1.beginFill(0x00FF00);
    // wall1.drawRect(0, 0, 10, app.view.height / PIXI.settings.RESOLUTION);
    // wall1.endFill();
    // wall1.x = 0;
    // wall1.y = 0;
    // app.stage.addChild(wall1);
    // colidables.push(wall1);

    hero.vx = 0;
    hero.vy = 0;
    hero.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    hero.y = 4 * 16 / PIXI.settings.RESOLUTION;
    heroAnim.stand();
    
    app.stage.addChild(hero);
    
    const {controls, updateState} = HeroState(((action, param) => {
        if(action === MOVING_LEFT) {
            console.log('moving left');
            hero.vx = -VELOCITY_X;
            hero.scale.x = -1;
            if(!param) {
                heroAnim.walk();
            }
        } else if (action === MOVING_RIGHT) {
            console.log('moving right');
            hero.vx = VELOCITY_X;
            hero.scale.x = 1;
            if(!param) {
                heroAnim.walk();
            }
        }

        if(action === RISING) {
            console.log('rising');
            hero.vy = -VELOCITY_Y;
            heroAnim.rise();

        } else if(action === FALLING) {
            console.log('falling');
            heroAnim.fall();
        }

        if(action === STANDING) {
            console.log('standing');
            hero.vx = 0;
            if(!param) {
                heroAnim.stand();
            }
        }
    }));

    keyboardDriver(controls);
    mobileDriver(controls);

    // app.ticker.maxFPS = 1;
    app.ticker.add(delta => {
        hero.vy += GRAVITY;
        const xu = hero.vx * delta;
        const yu = hero.vy * delta;
        
        hero.x += xu;
        hero.y += yu;

        const heroBB = parentPositionRef(hero.getChildAt(0).boundingBox);
        
        colidables.forEach((collidable) => {
            const hitResp = hitTestRectangle(heroBB, collidable);
            if(!!hitResp) {
                if(hitResp.overlapV.x) {
                    hero.vx = 0;
                    hero.x -= hitResp.overlapV.x;
                }
                if(hitResp.overlapV.y) {
                    hero.vy = 0;
                    hero.y -= hitResp.overlapV.y;
                }
            }
        });

        updateState(hero.vx, hero.vy);
    });
});
});

function parentPositionRef(child, xu = 0, yu = 0) {
    const parent = child.parent;
    const clone = child.clone();

    clone.x = parent.x + child.x;
    clone.y = parent.y + child.y;

    clone.x -= child.width / 2;
    clone.y -= child.pivot.y / 2;
    
    clone.x += xu;
    clone.y += yu;

    return clone;
}

function hitTestRectangle(obj1, obj2) {
    const box1 = toSatBoxPolygon(obj1);
    const box2 = toSatBoxPolygon(obj2);
    const response = new SAT.Response();
    const hit = SAT.testPolygonPolygon(box1, box2, response);
    if(hit) {
        return response;
    }
    return false;
}

function toSatBoxPolygon(obj) {
    return new SAT.Box(new SAT.Vector(obj.x, obj.y), obj.width, obj.height).toPolygon();
}

app.renderer.on('resize', () => {
    const bunny = app.stage.getChildAt(0);
    bunny.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    bunny.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION;
});