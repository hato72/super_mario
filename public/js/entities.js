import Entity,{Trait} from './Entity.js';
import { loadMarioSprite } from './sprites.js';
//import Velocity from './traits/Velocity.js'
import Jump from './traits/Jump.js'
import Go from './traits/Go.js';
import { loadSpriteSheet } from './loaders.js';
import { createAnim } from './Anim.js';

export function createMario(){
    //return loadMarioSprite('mario')
    return loadSpriteSheet('mario')
    .then(sprites =>{
        const mario = new Entity();
        mario.size.set(14,16);

        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        //mario.addTrait(new Velocity());


        const runAnim = createAnim(['run-1','run-2','run-3'],10);
        function routeFrame(mario){
            if (mario.jump.falling){
                return 'jump';
            }
            if(mario.go.distance > 0){
                if((mario.vel.x > 0 && mario.go.dir < 0) || (mario.vel.x < 0 && mario.go.dir > 0)){
                    return "break";
                }
                // const frameIndex = Math.floor(mario.go.distance /10) % frames.length;
                // const frameName = frames[frameIndex];
                return runAnim(mario.go.distance);
            }

            return 'idle';
        }
        

        mario.draw = function drawMario(context){
            sprites.draw(routeFrame(this),context,0,0,this.go.heading < 0);
        }

        return mario;
    })
    
}