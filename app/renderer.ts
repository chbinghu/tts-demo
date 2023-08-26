'use client'

import { AnimationMixer, AxesHelper, Box3, Box3Helper, BoxGeometry, BoxHelper, Clock, Color, Mesh, MeshBasicMaterial, PMREMGenerator, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Renderer {
    scene = new Scene();
    private camera: PerspectiveCamera;
    private controls: OrbitControls;
    private renderer: WebGLRenderer;
    private clock = new Clock();

    mixers: AnimationMixer[] = [];

    constructor(div: HTMLDivElement) {
        const rect = div.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        div.appendChild(this.renderer.domElement);
        
        this.camera = new PerspectiveCamera(10, width/height, 1, 40);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.init();
    }

    init = () => {
        this.initEnvironment();
        this.camera.position.z = 5;
        this.camera.lookAt(0,0,0);

        this.animate();
    }

    initEnvironment = () => {
        const environment = new RoomEnvironment( this.renderer );
        const pmremGenerator = new PMREMGenerator( this.renderer );

        this.scene.background = new Color( 0x666666 );
        this.scene.environment = pmremGenerator.fromScene( environment ).texture;
    }

    animate = () => {
        this.renderer.setAnimationLoop(() => {
            this.controls.update();
            const d = this.clock.getDelta();

            for(const mixer of this.mixers) {
                mixer.update(d);
            }
            this.renderer.render( this.scene, this.camera );

        })
    }

    addMixer(m: AnimationMixer) {
        this.mixers.push(m);
    }

    addGltf(gltf: GLTF) {
        const gltfScene = gltf.scene;

        gltfScene.updateMatrixWorld();
        const box = new Box3().setFromObject(gltfScene);
        const center = box.getCenter(new Vector3());

        gltfScene.position.add(new Vector3(
            gltfScene.position.x - center.x,
            gltfScene.position.y - center.y,
            gltfScene.position.z - center.z
        ))

        this.camera.position.set(0, 0, 4);
        this.controls.target.set(0, 0.2, 0);

        this.scene.add(gltfScene);
    }
}