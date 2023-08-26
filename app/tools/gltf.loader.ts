import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Loader {
    static instance: Loader = new Loader();

    static getInstance() {
        return this.instance;
    }

    private loader: GLTFLoader;

    constructor() {
        this.loader = new GLTFLoader().setMeshoptDecoder( MeshoptDecoder );
    }

    load = (path: string) => {
        return new Promise<GLTF>((resvole, reject) => {
            function onLoad(gltf: GLTF) {
                resvole(gltf);
            }

            function onError(e: any) {
                reject(e)
            }

            function onProcess() {

            }

            this.loader.load(path, onLoad, onProcess, onError);
        })
    }
}