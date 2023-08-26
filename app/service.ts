import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { ResultReason, SpeechSynthesisResult } from "microsoft-cognitiveservices-speech-sdk";
import { AnimationClip, NumberKeyframeTrack } from "three";

const speechConfig = sdk.SpeechConfig.fromSubscription('82b9dd6276334a259b35fd0d833f184f', 'eastasia');
speechConfig.speechSynthesisLanguage = "en-US";
speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

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

export async function reqeustTTS(sentence: string) {
    return new Promise<{audio: sdk.SpeechSynthesisResult, blendShapes: number[][]}>((resolve, reject) => {
        const blendShapes: number[][] = [];
    
        const xml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
          <voice name="en-US-JennyNeural">
            <mstts:viseme type="FacialExpression"/>
            ${sentence}
          </voice>
        </speak>
        `;
        
        function callback(result: SpeechSynthesisResult) {
            try {
                if(result.reason === ResultReason.SynthesizingAudioCompleted) {
                    resolve({
                        audio: result,
                        blendShapes: blendShapes,
                    });
                } else {
                    reject("Speech synthesis failed!")
                }
            } catch (e) {
                reject("Speech synthesis failed!");
            }
        }
        
        synthesizer.speakSsmlAsync(xml, callback, e => {
            synthesizer.close();
            reject(e);
        });

        synthesizer.visemeReceived = function (s, e) {
            if (e.animation) {
                const { BlendShapes: u } = JSON.parse(e.animation);
                blendShapes.push(...u)
            }
        }
    });
}
