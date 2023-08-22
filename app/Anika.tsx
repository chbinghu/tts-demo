'use client'

import { useEffect } from 'react';
import * as THREE from 'three';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const Anika = () => {
    useEffect(() => {
        const sceneDom = document.getElementById('scene');
        const rect = sceneDom?.getBoundingClientRect()!;
        console.log(rect);

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

        // const controls = new OrbitControls( camera, renderer.domElement );
        // controls.enableDamping = true;
        // controls.minDistance = 2.5;
        // controls.maxDistance = 5;
        // controls.minAzimuthAngle = - Math.PI / 2;
        // controls.maxAzimuthAngle = Math.PI / 2;
        // controls.maxPolarAngle = Math.PI / 1.8;

        scene.add( new THREE.AxesHelper( 20 ) );

        function animate() {
            requestAnimationFrame( animate );    
            renderer.render( scene, camera );
        }

        animate();

        new GLTFLoader().setMeshoptDecoder( MeshoptDecoder )
            .load('/anika.glb', (gltf) => {
                console.log(gltf);

                scene.add(gltf.scene);
            })
    }, [])

    return <div id="scene" className='w-full h-full min-h-full shrink relative transition-transform duration-500'></div>
}