import { loadLevel } from './loaders/level.js';
import { createMario } from './entities.js';
import Timer from './Timer.js';
import { createCollisionLayer,createCameraLayer, createSpriteLayer } from './layers.js';
import { setupKeyboard } from './input.js';
import Camera from './Camera.js';
import { setupMouseControl } from './debug.js';
import { loadMarioSprite } from './sprites.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    createMario(),
    loadLevel('1-1'),
])
.then(([mario,level]) => {
    const camera = new Camera();
    window.camera = camera;
    //const comp = new Compositor();
    mario.pos.set(64,64);
    //mario.vel.set(200,-600);

    // level.comp.layers.push(
    //     createCollisionLayer(level),
    //     createCameraLayer(camera),
    // );

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

    