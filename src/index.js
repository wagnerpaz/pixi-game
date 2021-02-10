import * as PIXI from 'pixi.js';
import nipplejs from 'nipplejs';

import heroAnim from './anims/heroAnim';
import keyboard from './utils/keyboard';

PIXI.settings.RESOLUTION = 5;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({transparent: true});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.view.style.backgroundColor = "#00FF00";

window.onresize = function()
{
    app.renderer.resize(window.innerWidth / PIXI.settings.RESOLUTION, window.innerHeight / PIXI.settings.RESOLUTION);
}
window.onresize();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

const nippleManager = nipplejs.create({zone: document.getElementById('controls-overlay'), color: '#333', maxNumberOfNipples: 1});

heroAnim(app).then(heroAnim => {
    const hero = new PIXI.Container();
    hero.vx = 0;
    hero.vy = 0;
    hero.addChild(...heroAnim.anims);
    hero.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    hero.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION;
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
    }

    app.ticker.add(delta => {
        hero.x += hero.vx * delta;
        hero.y += hero.vy * delta;
    });
});

app.renderer.on('resize', () => {
    const bunny = app.stage.getChildAt(0);
    bunny.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    bunny.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION;
});