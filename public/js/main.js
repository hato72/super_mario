import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Timer from './Timer.js';
import {createLevelLoader} from './loaders/level.js';
import {loadEntities} from './entities.js';
import {setupKeyboard} from './input.js';
//import {createCollisionLayer} from './layers.js';
import { createCollisionLayer } from './layers/collision.js';
import { loadFont } from './loaders/font.js';
import { createDashboardLayer } from './layers/dashboard.js';
import { createAudioLoader } from './loaders/audio.js';

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

class AudioBoard{
    constructor(context){
        this.context = context;
        this.buffers = new Map();
    }
    addAudio(name,buffer){
        this.buffers.set(name,buffer);
    }

    playAudio(name){
        const source = this.context.createBufferSource();
        source.connect(this.context.destination);
        source.buffer = this.buffers.get(name);
        source.start(0);
    }
}

async function main(canvas) {
    const context = canvas.getContext('2d');

    const [entityFactory,font] = await Promise.all([
        loadEntities(),
        loadFont()
    ]);

    const audioContext = new AudioContext();
    const audioBoard = new AudioBoard(audioContext);
    const loadAudio = createAudioLoader(audioContext);
    loadAudio('/audio/jump.ogg')
    .then(buffer =>{
        audioBoard.addAudio('jump',buffer);
        //audioBoard.playAudio('jump');
        // const source = audioContext.createBufferSource();
        // source.connect(audioContext.destination);
        // source.buffer = buffer;
        // source.start(0);
    })

    const loadLevel = await createLevelLoader(entityFactory);

    const level = await loadLevel('1-1');

    const camera = new Camera();

    const mario = entityFactory.mario();

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);


    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(createDashboardLayer(font,playerEnv));

    const input = setupKeyboard(mario);
    input.listenTo(window);

    const gameContext = {
        audioBoard,
        deltaTime: null,
    }

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        level.update(gameContext);

        camera.pos.x = Math.max(0, mario.pos.x - 100);

        level.comp.draw(context, camera);

        // font.draw('A',context,0,0);
        
    }

    timer.start();
}

const canvas = document.getElementById('screen');

const start = () =>{
    window.removeEventListener('click',start);
    main(canvas);
};

window.addEventListener('click',start);
//main(canvas);