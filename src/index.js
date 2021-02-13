import * as PIXI from 'pixi.js';
import SAT from 'sat';

import createHero from './actors/hero';
import heroAnim from './anims/heroAnim';
import createCave from './stages/cave';

export const GRAVITY = 0.098;
export const VELOCITY_X = 1;
export const VELOCITY_Y = 2;
export const SCROLL_AREA_WIDTH = 50;
export const SCROLL_AREA_HEIGHT = 50;

PIXI.settings.RESOLUTION = 5;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const RES = PIXI.settings.RESOLUTION;

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
    const {collidables, tilemap: caveMap} = await createCave(app);
    app.stage.addChild(caveMap);

    const {actor: hero, updateBeforeCol: updateHeroBC, updateAfterCol: updateHeroAC} = await createHero(app);
    app.stage.addChild(hero); 

    app.stage.x = 0;
    app.stage.y = (hero.x - SCROLL_AREA_HEIGHT) - hero.height / 2 - app.stage.height / 2;

    const scrollArea = new PIXI.Graphics();
    scrollArea.visible = true;
    scrollArea.lineStyle(1, 0xFF0000);
    scrollArea.drawRect( 
        0,
        0,
        SCROLL_AREA_WIDTH,
        SCROLL_AREA_HEIGHT
    );
    scrollArea.x = Math.max(hero.x - SCROLL_AREA_WIDTH / 2, app.stage.x);
    scrollArea.y = Math.max(hero.y - SCROLL_AREA_HEIGHT / 2, app.stage.y);
    
    app.stage.addChild(scrollArea);

    // app.ticker.maxFPS = 1;
    app.ticker.add(delta => {
        const oxu = hero.x;
        const oyu = hero.y;

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

        const nxu = hero.x - oxu;
        const nyu = hero.y - oyu;

        console.log(hero.x, scrollArea.x, caveMap.x, app.stage.x + app.stage.width, app.stage.width - app.view.width);

        if(hero.x  <= scrollArea.x && app.stage.x < 0) {
            scrollArea.x += nxu;
            app.stage.x -= nxu;
        }
        else if(hero.x  >= scrollArea.x + scrollArea.width && app.stage.x + app.stage.width > -app.stage.width) {
            scrollArea.x += nxu;
            app.stage.x -= nxu;
        }

        if(hero.y  <= scrollArea.y && app.stage.y < 0) {
            scrollArea.y += nyu;
            app.stage.y -= nyu;
        }
        else if(hero.y + hero.height >= scrollArea.y + scrollArea.height && app.stage.y + app.stage.height > -app.stage.height) {
            scrollArea.y += nyu;
            app.stage.y -= nyu;
        }

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