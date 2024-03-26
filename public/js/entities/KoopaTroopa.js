import Entity from "../Entity.js";
import { loadSpriteSheet } from "../loaders.js";
import { createAnim } from "../Anim.js";
import PendulumWalk from '../traits/PendulumWalk.js'

export function loadKoopa(){
    return loadSpriteSheet('koopa')
    .then(createKoopaFactory);
}

function createKoopaFactory(sprite){
    const walkAnim = createAnim(['walk-1','walk-2'],0.15);

    function drawKoopa(context){
        sprite.draw(walkAnim(this.lifetime),context,0,0,this.vel.x < 0);
    }

    return function createKoopa(){
        const koopa = new Entity();
        koopa.size.set(16,16);
        koopa.offset.y = +8;
        //koopa.lifetime = 0;

        koopa.addTrait(new PendulumWalk())

        koopa.draw = drawKoopa;

        return koopa;
    };
}