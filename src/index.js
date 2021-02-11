import * as PIXI from 'pixi.js';
import nipplejs from 'nipplejs';
import Bump from 'bump.js';
import SAT from 'sat';

import heroAnim from './anims/heroAnim';
import keyboard from './utils/keyboard';

PIXI.settings.RESOLUTION = 5;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const b = new Bump(PIXI);

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({transparent: true});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.view.style.backgroundColor = "#66CCFF";

window.onresize = function()
{
    app.renderer.resize(window.innerWidth / PIXI.settings.RESOLUTION, window.innerHeight / PIXI.settings.RESOLUTION);
}
window.onresize();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

const nippleManager = nipplejs.create({zone: document.getElementById('controls-overlay'), color: '#333', maxNumberOfNipples: 1});

const hero = new PIXI.Container();

heroAnim(PIXI, app, hero).then(heroAnim => {
    hero.vx = 0;
    hero.vy = 0;
    hero.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    hero.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION - hero.height;
    heroAnim.stand();
    
    app.stage.addChild(hero);
    
    nippleManager.on('start', (e, vJoystick) => {
        vJoystick.on('move', (e, {direction, force}) => {
            if(direction) {
                if(direction.x === "right") {
                    hero.vx = Math.min(force, 3) * 0.33;
                    hero.scale.x = 1;
                    heroAnim.walk();
                } else {
                    hero.vx = Math.min(force, 3) * -0.33;
                    hero.scale.x = -1;
                    heroAnim.walk();
                }
            }
        });
    });

    nippleManager.on('end', () => {
        hero.vx = 0;
        heroAnim.stand();
    });

    const moveLeft = keyboard("ArrowLeft");
    moveLeft.press = () => {
        hero.vx = -1;
        hero.scale.x = -1;
        heroAnim.walk();
    };
    moveLeft.release = () => {
        hero.vx = 0;
        heroAnim.stand();
    }

    const moveRight = keyboard("ArrowRight");
    moveRight.press = () => {
        hero.vx = 1;
        hero.scale.x = 1;
        heroAnim.walk();
    };
    moveRight.release = () => {
        hero.vx = 0;
        heroAnim.stand();
    };

    const moveUp = keyboard("ArrowUp");
    moveUp.press = () => {
        hero.vy = -1;
        heroAnim.walk();
    };
    moveUp.release = () => {
        hero.vy = 0;
        heroAnim.stand();
    };

    const moveDown = keyboard("ArrowDown");
    moveDown.press = () => {
        hero.vy = 1;
        heroAnim.walk();
    };
    moveDown.release = () => {
        hero.vy = 0;
        heroAnim.stand();
    };

    const floor = new PIXI.Graphics();
    floor.beginFill(0x00FF00);
    floor.drawRect(0, 0, app.view.width / 1.5 / PIXI.settings.RESOLUTION, app.view.height/ 1.5 / PIXI.settings.RESOLUTION);
    floor.endFill();
    floor.x = 0;
    floor.y = app.renderer.height / 1.5 / PIXI.settings.RESOLUTION;
    app.stage.addChild(floor);

    const wall1 = new PIXI.Graphics();
    wall1.beginFill(0x00FF00);
    wall1.drawRect(0, 0, 10, app.view.height / PIXI.settings.RESOLUTION);
    wall1.endFill();
    wall1.x = 0;
    wall1.y = 0;
    app.stage.addChild(wall1);

    app.ticker.add(delta => {
        const GRAVITY = 0.05;
        
        hero.vy += GRAVITY;
        const xu = hero.vx * delta;
        const yu = hero.vy * delta;

        const heroNewPosX = parentPositionRef(hero.getChildAt(0).boundingBox, xu, 0);
        if(hitTestRectangle(heroNewPosX, floor) && hero.vx !== 0) {
            hero.vx = 0;
        }
        else {
            hero.x += xu;
        }
        
        const heroNewPosY = parentPositionRef(hero.getChildAt(0).boundingBox, 0, yu);
        if(hitTestRectangle(heroNewPosY, floor) && hero.vy !== 0) {
            hero.vy = 0;
        }
        else {
            hero.y += yu;
        }
    });
});

function parentPositionRef(child, xu, yu) {
    const parent = child.parent;
    const clone = child.clone();

    clone.x = parent.x + child.x;
    clone.y = parent.y + child.y;

    clone.x -= child.pivot.x / 2;
    clone.y -= child.pivot.y / 2;
    
    clone.x += xu;
    clone.y += yu;

    return clone;
}

function hitTestRectangle(obj1, obj2) {
    const box1 = toSatBoxPolygon(obj1);
    const box2 = toSatBoxPolygon(obj2);
    return SAT.testPolygonPolygon(box1, box2);
}

function toSatBoxPolygon(obj) {
    return new SAT.Box(new SAT.Vector(obj.x, obj.y), obj.width, obj.height).toPolygon();
}

app.renderer.on('resize', () => {
    const bunny = app.stage.getChildAt(0);
    bunny.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    bunny.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION;
});