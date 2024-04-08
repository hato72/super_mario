//import Camera from './Camera.js';
import Timer from './Timer.js';
import {createLevelLoader} from './loaders/level.js';
import {loadFont} from './loaders/font.js';
import {loadEntities} from './entities.js';
import {createPlayer, createPlayerEnv} from './player.js';
import {setupKeyboard} from './input.js';
import {createCollisionLayer} from './layers/collision.js';
import {createDashboardLayer} from './layers/dashboard.js';
import SceneRunner from './SceneRunner.js';
//import LevelTimer from './traits/LevelTimer.js';


async function main(canvas) {
    //const context = canvas.getContext('2d');
    const videoContext = canvas.getContext('2d');
    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext),
        loadFont(),
    ]);


    const loadLevel = await createLevelLoader(entityFactory);

    const sceneRunner = new SceneRunner();

    //const level = await loadLevel('1-1');
    const level = await loadLevel('1-2');
    //const level = await loadLevel('debug-coin');

    //const camera = new Camera();

    const mario = createPlayer(entityFactory.mario());
    mario.player.name = "MARIO";
    level.entities.add(mario);

    // const luigi = createPlayer(entityFactory.mario());
    // luigi.pos.x += 32;
    // mario.player.name = "LUIGI";
    // level.entities.add(luigi);

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    // level.events.listen(LevelTimer.EVENT_oktimer, () => {
    //     level.music.player.playTrack('main');
    // });
    // level.events.listen(LevelTimer.EVENT_hurrytimer, () =>{
    //     level.music.player.playTrack('hurry');
    // });


    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(createDashboardLayer(font, level));

    //const input = setupKeyboard(mario);
    //input.listenTo(window);
    const inputRouter = setupKeyboard(window);
    inputRouter.addReceiver(mario);
    //inputRouter.addReceiver(luigi);

    sceneRunner.addScene(level);

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime: null,
    };

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        // level.update(gameContext);
        // level.draw(gameContext);
        sceneRunner.update(gameContext);

        // camera.pos.x = Math.max(0, mario.pos.x - 100);

        // level.comp.draw(context, camera);
    }

    timer.start();
    //level.music.player.playTrack('main');

    sceneRunner.runNext();
}

const canvas = document.getElementById('screen');

const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};

window.addEventListener('click', start);