import Entity, {Trait} from '../Entity.js';
import Stomper from './Stomper.js';

const COIN_threshold = 100;

export default class Player extends Trait {
    constructor() {
        super('player');
        this.name = "unnamed";
        this.coins = 0;
        this.lives = 3;
        this.score = 0;

        this.listen(Stomper.EVENT_stomp, () => {
            this.score += 100;
        });
    }

    addCoins(count){
        this.coins += count;
        this.queue(entity => entity.sounds.add('coin'));
        // if(this.coins >= COIN_threshold){
        //     const lifeCount = Math.floor(this.coins / COIN_threshold);
        //     this.addLives(lifeCount);
        //     this.coins = this.coins % COIN_threshold;
        // }
        while(this.coins >= COIN_threshold){
            this.addLives(1);
            this.coins -= COIN_threshold;
        }
    }

    addLives(count){
        this.lives += count;
    }
}