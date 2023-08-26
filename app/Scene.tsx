'use client'

import { useEffect, useRef } from "react"
import { Renderer } from "./renderer";
import { Anika } from "./gltfModel/Anika";
import { Button } from "./components/Button";

export const Scene = () => {
    const ref = useRef<HTMLDivElement>(null);
    const anika = useRef(Anika.getInstance())
    useEffect(() => {
        if(ref.current !== null) {
            const renderer = new Renderer(ref.current);

            anika.current.load()
                .then(gltf => {
                    if(gltf) {
                        renderer.addGltf(gltf);
                        if(anika.current.mixer) {
                            renderer.addMixer(anika.current.mixer);
                        }
                    }
                })
        }

        return () => {
            if(ref.current && ref.current.firstChild) {
                ref.current.removeChild(ref.current.firstChild)
            }
        }
    }, [])

    function onClick() {
        anika.current.speek('hello, hello')
    }

    return <div className="flex w-full h-full min-h-full shrink flex-row">
        <div ref={ref} className='w-full h-full min-h-full shrink'>
        </div>
        <div className="w-50 h-full">
            <Button onClick={onClick}> click </Button>
        </div>
    </div>
    
}