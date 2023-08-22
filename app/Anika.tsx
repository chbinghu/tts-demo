'use client'

import { useEffect } from 'react';
import * as THREE from 'three';
import { Color, Mesh, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { clipBase_Layer, clipBlink, clipHello, clipRes } from './config';

export const Anika = () => {
    useEffect(() => {
        const sceneDom = document.getElementById('scene');
        const rect = sceneDom?.getBoundingClientRect()!;

        const clock = new THREE.Clock();

        const scene = new Scene();
        const camera = new PerspectiveCamera( 15, rect.width / rect.height, 1, 20 );
        camera.position.set( 0, 1.5, 2 );
        camera.lookAt(0, 1.5, 0);

        const renderer = new WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize( rect.width, rect.height );
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        sceneDom?.appendChild(renderer.domElement);

        const environment = new RoomEnvironment( renderer );
        const pmremGenerator = new THREE.PMREMGenerator( renderer );

        scene.background = new THREE.Color( 0x666666 );
        scene.environment = pmremGenerator.fromScene( environment ).texture;

        scene.add( new THREE.AxesHelper( 20 ) );
        let Anika010Mixer: THREE.AnimationMixer;
        let rigMixer: THREE.AnimationMixer;
        let rigAction: THREE.AnimationAction;
        let blinkAction: THREE.AnimationAction;

        const loadingManager = new THREE.LoadingManager();
        loadingManager.onLoad = function() {
            if(rigAction) {
                rigAction.fadeIn(0.1).play();
                setTimeout(()=>{
                    rigAction.crossFadeTo(blinkAction, 2, !0),
                    blinkAction.play()
                })
            }

            if(Anika010Mixer) {
                const action = Anika010Mixer.clipAction(clipBase_Layer);
                action.setLoop(THREE.LoopRepeat, 10);
                action.timeScale = .8;
                action.play()
            }
        }

        new GLTFLoader(loadingManager).setMeshoptDecoder( MeshoptDecoder )
            .load('/anika.glb', (gltf) => {
                console.log(gltf);

                scene.add(gltf.scene);

                const rig = gltf.scene.getObjectByName("Fem-A_Anika_RIG");
                console.log('rig', rig);
                rigMixer = new THREE.AnimationMixer( rig! );
                rigAction = rigMixer.clipAction(clipHello);
                rigAction.setLoop(THREE.LoopOnce, 1);
                blinkAction = rigMixer.clipAction(clipBlink);
                
                const Anika010 = gltf.scene.getObjectByName('Fem-A_Whl_BY_Anika010')! as Mesh;
                //@ts-ignore
                Anika010.material.depthWrite = !0;
                Anika010.castShadow = !0;
                Anika010.receiveShadow = !0;

                const Anika010_1 = gltf.scene.getObjectByName("Fem-A_Whl_BY_Anika010_1")! as Mesh;
                const Anika010_5 = gltf.scene.getObjectByName("Fem-A_Whl_BY_Anika010_5")! as Mesh;
                const Anika010_4 = gltf.scene.getObjectByName("Fem-A_Whl_BY_Anika010_4")! as Mesh;
                const Anika010_3 = gltf.scene.getObjectByName("Fem-A_Whl_BY_Anika010_3")!;
                const mesh_7 = gltf.scene.getObjectByName("mesh_7")!;
                const c_tong_01x = gltf.scene.getObjectByName("c_tong_01x")!;

                //@ts-ignore
                mesh_7.material.color = new Color(5912613);

                //@ts-ignore
                // Anika010_3.material.envMap = s;
                //@ts-ignore
                Anika010_3.material.envMapIntensity = 3;

                //@ts-ignore
                Anika010_1.material.opacity = .3;
                //@ts-ignore
                Anika010_1.material.color = new Color(5912613);
                //@ts-ignore
                Anika010_4.material.opacity = .2;
                //@ts-ignore
                Anika010_4.material.color = new Color(5912613);
                mesh_7.receiveShadow = !0;
                Anika010_5.receiveShadow = !0;
                Anika010_5.castShadow = !0;
                c_tong_01x.translateZ(-.0025);

                Anika010Mixer = new THREE.AnimationMixer(Anika010);
                Anika010Mixer.clipAction(clipBase_Layer).setLoop(THREE.LoopOnce, 1);

                const P = Anika010.morphTargetInfluences;
                Anika010_1.morphTargetInfluences = P;
                Anika010_5.morphTargetInfluences = P;
                Anika010_4.morphTargetInfluences = P;

                setTimeout(() => {
                    const action = Anika010Mixer.clipAction(clipRes);
                    action.setLoop(THREE.LoopOnce, 10);
                    action.fadeIn(0.1).play();
                    setTimeout( ()=>action.fadeOut(.25),  1 )
                }, 5000);
            });

        renderer.setAnimationLoop(() => {
            const p = clock.getDelta();
            Anika010Mixer && Anika010Mixer.update(p);
            rigMixer && rigMixer.update(p);
            renderer.render( scene, camera );
        })
    
    }, [])

    return <div id="scene" className='w-full h-full min-h-full shrink relative transition-transform duration-500'></div>
}