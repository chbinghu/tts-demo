import { AnimationClip, AnimationMixer, LoopOnce, Mesh, NumberKeyframeTrack } from "three";
import { Loader } from "../tools/gltf.loader";
import { reqeustTTS } from "../service";

const lipIndex: { [key: number]: number } = {
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 22,
    22: 21,
    23: 23,
    24: 24,
    25: 26,
    26: 25,
    27: 27,
    28: 28,
    29: 29,
    30: 30,
    31: 31,
    32: 32,
    33: 33,
    34: 34,
    35: 35,
    36: 36,
    37: 37,
    38: 38,
    39: 39,
    40: 40,
    46: 46,
    47: 47,
    48: 48,
    51: 51
};

/**
 * 
 * @param blendShape 
 * @param frameValueMap
 *  blendShape 中的数据格式是：时间序列 -> 所有的面部表情数据
 *  需要转换为 指定位置 -> 按时间排序的数据
 */
const parseLipData = (blendShape: number[], frameValueMap: { [key: number]: number[] } ) => {
    for (const [key, value] of Object.entries(lipIndex)) {
        if( frameValueMap[value] === undefined) {
            frameValueMap[value] = [];
        }
        frameValueMap[value].push(blendShape[value]);
    }
}

const createKeyFrames = (frameValueMap: { [key: number]: number[] }, times: number[])=>{
    const frames: NumberKeyframeTrack[]  = [];
    for (const [index, values] of Object.entries(frameValueMap)) {
        const s = new NumberKeyframeTrack(`.morphTargetInfluences[${index}]`, times, values);
        frames.push(s)
    }
    return frames
}

export class Anika {
    static instacne: Anika = new Anika();
    static getInstance() {
        return this.instacne;
    }
    mixer: AnimationMixer | undefined;
    constructor() {
    }

    load = async () => {
        return Loader.getInstance().load('/anika.glb')
            .then(gltf => {        
                const Anika010 = gltf.scene.getObjectByName('Fem-A_Whl_BY_Anika010') as Mesh;                
                this.mixer = new AnimationMixer(Anika010);
    
                return gltf;
            })
            .catch(e => {
                console.log('anika.glb load error', e)
                return undefined;
            })
    }

    request = (sentence: string) => {
        return reqeustTTS(sentence)
            .then(result => {
                const blendShapes = result.blendShapes;

                const times = [];
                const step = .016666666666666666;
                const frameValueMap: { [key: number]: number[] } = {};

                if(blendShapes.length === 0) {
                    return {
                        audio: result.audio,
                        clips: undefined
                    }
                } else {
                    for(let i=0; i < blendShapes.length; i++) {
                        times.push(step * i);
                        parseLipData(blendShapes[i], frameValueMap)
                    }

                    const duration = times.length * step;
                    const keyFrames = createKeyFrames(frameValueMap, times)
                    const clips = new AnimationClip("faceGrpAnim", duration, keyFrames);

                    return {
                        audio: result.audio,
                        clips: clips
                    }
                }
            })
    }

    speek(p: string) {
        this.request(p)
            .then(result => {
                if(result.clips) {
                    const t = result.audio.audioDuration / 1e4;

                    const action = this.mixer?.clipAction(result.clips);
                    action?.setLoop(LoopOnce, 1);
                    action?.fadeIn(0.1).play();

                    setTimeout( ()=> action?.fadeOut(.25), t - 1e3);
                }
            })
    }
}