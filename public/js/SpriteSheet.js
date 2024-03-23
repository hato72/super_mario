export default class SpriteSheet{
    constructor(image,width,height){
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
        this.animation = new Map();
    }

    defineAnim(name,animation){
        this.animation.set(name,animation);
    }

    define(name,x,y,width,height){
        const buffers = [false,true].map(flip =>{
            const buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;
            const context = buffer.getContext('2d');

            if(flip){
                context.scale(-1,1);
                context.translate(-width,0);
            }
            
            context.drawImage(
                this.image,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height);

            return buffer;
        })

        this.tiles.set(name,buffers);

        // const buffer = document.createElement('canvas');
        // buffer.width = width;
        // buffer.height = height;
        

        // buffer.getContext('2d').drawImage(
        //     this.image,
        //     x,
        //     y,
        //     width,
        //     height,
        //     0,
        //     0,
        //     width,
        //     height
        // )

        //this.tiles.set(name,buffer);
    }

    defineTile(name,x,y){
        this.define(name,x*this.width,y*this.height,this.width,this.height);
    }

    draw(name,context,x,y,flip = false){
        //const buffer = this.tiles.get(name);
        const buffer = this.tiles.get(name)[flip ? 1 : 0]; //1でミラーに
        context.drawImage(buffer,x,y);
    }

    drawAnim(name,context,x,y,distance){
        const animation = this.animation.get(name)
        this.drawTile(animation(distance),context,x,y)
    }

    drawTile(name,context,x,y){
        this.draw(name,context,x*this.width,y*this.height);
    }
}