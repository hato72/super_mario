import {Trait} from '../Entity.js';

export default class LevelTimer extends Trait {
    static EVENT_hurrytimer = Symbol('timer hurry');
    static EVENT_oktimer = Symbol('timer ok');

    constructor() {
        super('levelTimer');
        this.totalTime = 300;
        this.currentTime = this.totalTime;
        this.hurryTime = 100;
        this.hurryEmitted = null;
    }

    update(entity, {deltaTime}, level) {
        this.currentTime -= deltaTime * 2;
        //entity.vel.y += level.gravity * deltaTime;
        if(this.hurryEmitted !== true && this.currentTime < this.hurryTime){
            level.events.emit(LevelTimer.EVENT_hurrytimer);
            this.hurryEmitted = true;
        }
        if(this.hurryEmitted !== false && this.currentTime > this.hurryTime){
            level.events.emit(LevelTimer.EVENT_oktimer);
            this.hurryEmitted = false;
        }
    }
}