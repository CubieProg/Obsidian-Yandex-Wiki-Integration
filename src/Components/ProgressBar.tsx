import {
    useContext,
    useEffect,
    useState,
    useRef,
} from 'react'

import { YwIContext } from 'src/Model/YWIContext'

export const ProgressBar = () => {
    const [progress, setProgress] = useState(0.0);
    const [fileName, setFileName] = useState("");
    const { plugin } = useContext(YwIContext)
    const [progressBarWidth, setProgressBarWidth] = useState(0);

    const [currentWidth, setCurrentWidth] = useState(progress * progressBarWidth);

    const ref = useRef(null);
    const ref1 = useRef(null);

    const component = <div>
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
                ref={ref1}
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

    useEffect(() => {
        // Контролим ширину компонента
        const current: any = ref?.current
        const width = current?.offsetWidth

        if (width > 0) {
            setProgressBarWidth(width);
        }

        // Прослушиваем изменения
        const interval = setInterval(() => {
            setProgress(v => plugin.transaction.progress);
            setCurrentWidth(v => plugin.transaction.progress * progressBarWidth)
            setFileName(v => plugin.transaction.fileName);

        }, 100);
        return () => clearInterval(interval);
    }, [component]);

    return component
};