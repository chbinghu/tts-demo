import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { ResultReason, SpeechSynthesisResult } from "microsoft-cognitiveservices-speech-sdk";
import { AnimationClip, NumberKeyframeTrack } from "three";

const speechConfig = sdk.SpeechConfig.fromSubscription('82b9dd6276334a259b35fd0d833f184f', 'eastasia');
speechConfig.speechSynthesisLanguage = "en-US";
speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

const Nf: { [key: number]: number } = {
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

// 将嘴唇部分的动画数据提取出来
const Of = (r: number[], e: any) => {
    for (const [t, n] of Object.entries(Nf)) {
        e[t] || (e[t] = []);
        e[t].push(r[n]);
    }
}

const Bf = (r: any, times: number[])=>{
    const t = [];
    for (const [n, i] of Object.entries(r)) {
        const s = new NumberKeyframeTrack(`.morphTargetInfluences[${n}]`, times, i as number[]);
        t.push(s)
    }
    return t
}

export async function reqeustTTS() {
    return new Promise<{audio: any, clip: AnimationClip | undefined}>((resolve, reject) => {
        const blendShapes: number[][] = [];
    
        const xml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
          <voice name="en-US-JennyNeural">
            <mstts:viseme type="FacialExpression"/>
            Rainbow has seven colors: Red, orange, yellow, green, blue, indigo, and violet.
          </voice>
        </speak>
        `;
        
        function callback(c: SpeechSynthesisResult) {
            try {
                if(c.reason === ResultReason.SynthesizingAudioCompleted) {
                    const times = [];
                    const step = .016666666666666666;
                    const h: { [key: number]: number[] } = {};

                    for(let i=0; i < blendShapes.length; i++) {
                        times.push(step * i);
                        Of(blendShapes[i], h)
                    }
                    if(times.length === 0) {
                        resolve({
                            audio: c,
                            clip: undefined,
                        })
                    }
                    const duration = times.length * step;
                    const p = Bf(h, times)
                    const g = new AnimationClip("faceGrpAnim", duration, p);
                    resolve({
                        audio: c,
                        clip: g,
                    })
                } else {
                    reject('"Speech synthesis failed!"')
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
