import { loadJSON } from "../loaders.js";
import AudioBoard from "../AudioBoard.js";

// const audioContext = new AudioContext();
// const audioBoard = new AudioBoard(audioContext);
// const loadAudio = createAudioLoader(audioContext);
// loadAudio('/audio/jump.ogg')
// .then(buffer =>{
//     audioBoard.addAudio('jump',buffer);
//     //audioBoard.playAudio('jump');
//     // const source = audioContext.createBufferSource();
//     // source.connect(audioContext.destination);
//     // source.buffer = buffer;
//     // source.start(0);
// });
// loadAudio('/audio/stomp.ogg')
// .then(buffer =>{
//     audioBoard.addAudio('stomp',buffer);
// });
// loadAudio('/audio/coin.ogg')
// .then(buffer =>{
//     audioBoard.addAudio('coin',buffer);
// });

export function loadAudioBoard(name,audioContext){
    const loadAudio = createAudioLoader(audioContext);
    return loadJSON(`/sounds/${name}.json`)
    .then(audioSheet =>{
        const audioBoard = new AudioBoard(audioContext);
        const fx = audioSheet.fx;
        const jobs = [];
        Object.keys(fx).forEach(name =>{
            const url = fx[name].url;
            const job = loadAudio(url).then(buffer =>{
                audioBoard.addAudio(name,buffer);
            });
            jobs.push(job);
        });
        return Promise.all(jobs).then(() => audioBoard);
    });
}

export function createAudioLoader(context){
    return function loadAudio(url){
        return fetch(url)
        .then(response =>{
            return response.arrayBuffer();
        })
        .then(arrayBuffer=>{
            return context.decodeAudioData(arrayBuffer);
        });
    };
}