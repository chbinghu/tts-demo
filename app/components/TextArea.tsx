import { ChangeEventHandler } from "react"

interface TextAreaProps {
    onChange: (text: string) => void;
}

export function TextArea(props: TextAreaProps) {

    const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const value = e.target.value;
        props.onChange(value);
    }

    return <div>
        <label htmlFor="story" className="text-black">Input what you want :</label>

        <textarea id="story" name="story" rows={5} cols={33}
            className="p-2 leading-tight rounded-sm border-2 border-black border-solid text-black"
            onChange={onChange}
        >
        </textarea>
    </div>
}