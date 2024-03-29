import { Trait } from "../Entity.js";


export default class Behavior extends Trait{
    constructor(){
        super('behavior');
    }

    collides(us,them){
        if(us.killable.dead){
            return;
        }

        if(them.stomper){
            if(them.vel.y > us.vel.y){
                us.killable.kill();
                //them.stomper.bounce();
                us.pendulumMove.speed = 0;
            }else{
                them.killable.kill();
            }
        }
        
    }
}