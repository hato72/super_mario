import { createLevelLoader } from './loaders/level.js';
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


async function main(canvas){
    const context = canvas.getContext('2d');
    const entityFactory = await loadEntities();
    const loadLevel = await createLevelLoader(entityFactory);

    const level = await loadLevel('1-1');

// loadEntities()
// .then(entityFactory => Promise.all([
//     entityFactory,
//     createLevelLoader(entityFactory),
// ]))
// .then(([entityFactory,loadLevel]) => Promise.all([
//     entityFactory,
//     loadLevel('1-1')
// ]))
// Promise.all([
//     // loadMario(),
//     // loadGoomba(),
//     // loadKoopa(),
//     loadEntities(),
//  createLevelLoader()('1-1'),
// ])

// .then(([factory,level]) => {
    
    const camera = new Camera();
    
    //const comp = new Compositor();

    const mario = entityFactory.mario();
    mario.pos.set(64,64);

    const goomba = entityFactory.goomba();
    goomba.pos.x = 220;
    level.entities.add(goomba);

    const koopa = entityFactory.koopa();
    koopa.pos.x = 260;
    level.entities.add(koopa);

    level.entities.add(mario);

    // level.comp.layers.push(
    //     createCollisionLayer(level),
    //     createCameraLayer(camera),
    // );
    level.comp.layers.push(
        createCollisionLayer(level)
    )

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
// });
}
    

const canvas = document.getElementById('screen');
main(canvas);