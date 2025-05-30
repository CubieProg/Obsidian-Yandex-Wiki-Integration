import {
    createContext,
    Dispatch,
    ReactNode,
    useContext,
    useReducer,
    MouseEvent,
    useEffect,
    useLayoutEffect,
    useState,
    useRef,
} from 'react'

import { YwIContext } from 'src/Model/YWIContext'

export const ProgressBar_ = () => {
    const { navigationTree, setNavigationTree, sessionData, plugin } = useContext(YwIContext)

    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log("useEffect runs");

        const interval = setInterval(() => {
            setCount((prevCount) => prevCount + 1);
            setCount(count + 1);
            console.log(count)
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <div></div>
}


export const ProgressBar = () => {
    const [progress, setProgress] = useState(0.5);
    const [fileName, setFileName] = useState("Главная страница");
    const { plugin } = useContext(YwIContext)
    const [progressBarWidth, setProgressBarWidth] = useState(0);

    const [currentWidth, setCurrentWidth] = useState(progress * progressBarWidth);

    const ref = useRef(null);


    // Контролим ширину компонента
    useLayoutEffect(() => {
        const current: any = ref?.current
        const width = current?.offsetWidth

        if (width > 0) {
            setProgressBarWidth(width);
        }
    }, []);

    // Прослушиваем изменения
    // useEffect(() => {
    //     console.log("useEffect runs");

    //     const interval = setInterval(() => {
    //         setCount((prevCount) => prevCount + 1);
    //         setCount(count + 1);
    //         console.log(count)
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    return <div>
        <div style={{ fontSize: 13, color: "currentColor", opacity: 0.6, paddingBottom: 8 }}>
            {fileName}
        </div>
        <div
            style={{
                position: "relative"
            }}
        >
            <div
                ref={ref}
                style={{
                    height: 8,
                    width: "100%",
                    background: "currentColor",
                    opacity: 0.05,
                    borderRadius: 4
                }}
            ></div>

            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: 8,
                    width: currentWidth,
                    background: "rgb(152, 115, 247)",
                    borderRadius: 4
                }}
            ></div>
        </div>
    </div>
};