interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode
}

export function Button(props: ButtonProps) {
    function clickHandler() {
        props.onClick && props.onClick();
    }
    
    return <div 
        className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        onClick={clickHandler}
    >
        {props.children}
    </div>
}