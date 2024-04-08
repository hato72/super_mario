import InputRouter from './InputRouter.js';
import KeyboardState from './KeyboardState.js';

export function setupKeyboard(window){
    const input = new KeyboardState();
    const router = new InputRouter();

    input.listenTo(window);

    input.addMapping('KeyP',keyState =>{
        if(keyState){
            router.route(entity => entity.jump.start());
            //entity.jump.start();
        }else{
            router.route(entity => entity.jump.cancel());
        }
        //console.log(keyState);
    })
    input.addMapping('KeyO',keyState =>{
        router.route(entity => entity.turbo(keyState));
    })
    input.addMapping('KeyD',keyState =>{
        router.route(entity => entity.go.dir += keyState ? 1 : -1);
    })
    input.addMapping('KeyA',keyState =>{
        router.route(entity => entity.go.dir += keyState ? -1 : 1);
    })

    return router;
}