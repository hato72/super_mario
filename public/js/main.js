import { loadLevel } from './loaders/level.js';
//import { loadMario } from './entities/Mario.js';
import Timer from './Timer.js';
import { createCollisionLayer,createCameraLayer, createSpriteLayer } from './layers.js';
import { setupKeyboard } from './input.js';
import Camera from './Camera.js';
//import { setupMouseControl } from './debug.js';
//import { loadMarioSprite } from './sprites.js';
//import { loadGoomba } from './entities/goomba.js';
//import { loadKoopa } from './entities/KoopaTroopa.js';
import { loadEntities } from './entities.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    // loadMario(),
    // loadGoomba(),
    // loadKoopa(),
    loadEntities(),
    loadLevel('1-1'),
])
.then(([factory,level]) => {
    const camera = new Camera();
    window.camera = camera;
    //const comp = new Compositor();

    const mario = factory.mario();
    mario.pos.set(64,64);

    const goomba = factory.goomba();
    goomba.pos.x = 220;
    level.entities.add(goomba);

    const koopa = factory.koopa();
    koopa.pos.x = 260;
    level.entities.add(koopa);


    // level.comp.layers.push(
    //     createCollisionLayer(level),
    //     createCameraLayer(camera),
    // );
    level.comp.layers.push(
        createCollisionLayer(level)
    )

    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    //setupMouseControl(canvas,mario,camera);

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime){
        level.update(deltaTime);

        if (mario.pos.x > 100){
            camera.pos.x = mario.pos.x - 100;
        }

        level.comp.draw(context,camera);
    }
    timer.start()
});

    