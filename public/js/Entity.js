import {Vec2} from './math.js';
import AudioBoard from './AudioBoard.js';
import BoundingBox from './BoundingBox.js';
//import EventEmitter from './EventEmitter.js';
import EventBuffer from './EventBuffer.js';

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
};

export class Trait {
    static EVENT_task = Symbol('task');

    constructor(name) {
        this.NAME = name;

        // this.events = new EventBuffer();
        //this.tasks = [];
        this.listeners = [];
    }

    listen(name,callback,count = Infinity){
        const listener = {name,callback,count};
        this.listeners.push(listener);
    }

    finalize(entity) {
        this.listeners = this.listeners.filter(listener =>{
            entity.events.process(listener.name,listener.callback);
            return --listener.count;
        })
        // for (const listener of this.listeners){
        //     entity.events.process(listener.name,listener.callback);
        // }

        // this.tasks.forEach(task => task());
        // this.tasks.length = 0;
    }

    queue(task) {
        this.listen(Trait.EVENT_task,task,1);
        //this.tasks.push(task);
    }

    collides(us, them) {

    }

    obstruct() {

    }

    update() {

    }
}

// class Parent{
//     constructor(){
//         this.child = null;
//     }

//     setChild(child){
//         this.child = child;
//     }
// }

// class Child{
//     constructor(parent){
//         this.parent = parent;
//     }
// }

export default class Entity {
    constructor() {
        this.audio = new AudioBoard();
        this.sounds = new Set();

        this.events = new EventBuffer();

        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.offset = new Vec2(0, 0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
        this.entity = this;
    }

    collides(candidate) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        });
    }

    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }

    draw() {

    }

    finalize() {
        this.events.emit(Trait.EVENT_task,this);

        this.traits.forEach(trait => {
            trait.finalize(this);
        });

        this.events.clear();
    }

    playSounds(audioBoard, audioContext) {
        this.sounds.forEach(name => {
            audioBoard.playAudio(name, audioContext);
        });

        this.sounds.clear();
    }

    update(gameContext, level) {
        this.traits.forEach(trait => {
            trait.update(this, gameContext, level);
        });

        this.playSounds(this.audio, gameContext.audioContext);

        this.lifetime += gameContext.deltaTime;
    }
}