import Entity,{Trait} from './Entity.js';
import { loadMarioSprite } from './sprites.js';
//import Velocity from './traits/Velocity.js'
import Jump from './traits/Jump.js'
import Go from './traits/Go.js';
//import { loadSpriteSheet } from './loaders.js';

export function createMario(){
    return loadMarioSprite('mario')
    .then(sprites =>{
        const mario = new Entity();
        mario.size.set(14,16);

        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        //mario.addTrait(new Velocity());

        // const frames = ['run-1','run-2','run-3'];

        // function routeFrame(mario){
        //     if(mario.go.dir !== 0){
        //         return 'run-1';
        //     }

        //     return 'idle';
        // }
        

        mario.draw = function drawMario(context){
            sprites.draw('idle',context,0,0);
        }

        return mario;
    })
    
}