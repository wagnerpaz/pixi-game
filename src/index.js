import * as PIXI from 'pixi.js';

PIXI.settings.RESOLUTION = 4;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({transparent: true});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.view.style.backgroundColor = "#FF00FF";

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

    const heroWalking = new PIXI.AnimatedSprite(sheet.spritesheet.animations["hero_walking"]);

    heroWalking.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    heroWalking.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION;
    console.log(heroWalking)

    heroWalking.animationSpeed = 0.1; 
    heroWalking.play();

    app.stage.addChild(heroWalking);
});

app.renderer.on('resize', () => {
    const bunny = app.stage.getChildAt(0);
    bunny.x = app.renderer.width / 2 / PIXI.settings.RESOLUTION;
    bunny.y = app.renderer.height / 2 / PIXI.settings.RESOLUTION;
});