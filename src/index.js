import * as PIXI from 'pixi.js';
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

// load the texture we need
app.loader.add('hero.json').load((loader, resources) => {
    const sheet = resources['hero.json'];
    console.log(sheet);

    const hero = new PIXI.Container();
    hero.vx = 0;
    hero.vy = 0;

    const heroStanding = new PIXI.AnimatedSprite(sheet.spritesheet.animations["hero_standing"]);
    setAnchor(heroStanding);
    heroStanding.visible = true;
    heroStanding.animationSpeed = 0.025; 
    heroStanding.play();
    hero.addChild(heroStanding);

    const heroWalking = new PIXI.AnimatedSprite(sheet.spritesheet.animations["hero_walking"]);
    setAnchor(heroWalking);
    heroWalking.visible = false;
    heroWalking.animationSpeed = 0.1; 
    hero.addChild(heroWalking);

    const moveLeft = keyboard("ArrowLeft");
    moveLeft.press = () => {
        heroStanding.stop();
        heroStanding.visible = false;
        
        hero.vx = -1;
        hero.scale.x = -1;
        heroWalking.visible = true;
        heroWalking.play();
    };
    moveLeft.release = () => {
        heroWalking.visible = false;
        heroWalking.stop();

        hero.vx = 0;
        heroStanding.visible = true;
        heroStanding.play();
    }

    const moveRight = keyboard("ArrowRight");
    moveRight.press = () => {
        heroStanding.stop();
        heroStanding.visible = false;
        
        hero.vx = 1;
        hero.scale.x = 1;
        heroWalking.visible = true;
        heroWalking.play();
    };
    moveRight.release = () => {
        heroWalking.visible = false;
        heroWalking.stop();

        hero.vx = 0;
        heroStanding.visible = true;
        heroStanding.play();
    }

    hero.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    hero.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION;

    app.stage.addChild(hero);

    app.ticker.add(delta => {
        hero.x += hero.vx * delta;
        hero.y += hero.vy * delta;
    });
});

function setAnchor(sprite) {
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
}

app.renderer.on('resize', () => {
    const bunny = app.stage.getChildAt(0);
    bunny.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    bunny.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION;
});