import * as PIXI from 'pixi.js';
import SAT from 'sat';

import createHero from './actors/hero';
import createCave from './stages/cave';

export const GRAVITY = 0.098;
export const VELOCITY_X = 1;
export const VELOCITY_Y = 2;

PIXI.settings.RESOLUTION = 5;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

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

async function load() {
    const {collidables} = await createCave(app);
    const {actor: hero, updateBeforeCol: updateHeroBC, updateAfterCol: updateHeroAC} = await createHero(app);
    app.stage.addChild(hero); 

    // app.ticker.maxFPS = 1;
    app.ticker.add(delta => {
        updateHeroBC(delta);

        collidables.every((collidable) => {
            let heroBB = parentPositionRef(hero.getChildAt(0).boundingBox);
            let hitResp = hitTestRectangle(heroBB, collidable);
            if(!!hitResp) {
                if(hitResp.overlapV.x) {
                    hero.x -= hitResp.overlapV.x;
                }
                else if(hitResp.overlapV.y) {
                    hero.vy = 0;
                    hero.y -= hitResp.overlapV.y;
                }
            }

            return true;
        });

        updateHeroAC(delta);
    });
};
load();



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