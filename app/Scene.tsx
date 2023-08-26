'use client'

import { useEffect, useRef, useState } from "react"
import { Renderer } from "./renderer";
import { Anika } from "./gltfModel/Anika";
import { Button } from "./components/Button";
import { TextArea } from "./components/TextArea";

export const Scene = () => {
    const ref = useRef<HTMLDivElement>(null);
    const anika = useRef(Anika.getInstance());
    const [text, setText] = useState<string>('');
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
        anika.current.speek(text);
    }

    function handleTextAreaChange(text: string) {
        setText(text);
    }

    return <div className="flex w-full h-full min-h-full shrink flex-row">
        <div ref={ref} className='w-full h-full min-h-full'>
        </div>
        <div className="w-80 h-full flex-none">
            <TextArea onChange={handleTextAreaChange} />
            <Button onClick={onClick}> speak </Button>
        </div>
    </div>
    
}