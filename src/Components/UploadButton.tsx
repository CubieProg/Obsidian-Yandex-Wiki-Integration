import { useState, useContext } from 'react';
import { YwIContext } from "../Model/YWIContext"
import { Plugin } from 'obsidian';

type UploadButtonType = {
    plugin?: Plugin,
    onParentClick?: Function
    setOnParentClick?: Function
}

export const UploadButton = () => {
    const [isRun, setIsRun] = useState(false);
    const { plugin } = useContext(YwIContext);

    const handleClick = async () => {
        plugin.app.vault.trigger("yandex-wiki-integration:upload-to-home")
    };

    return (
        <svg
            className='widget-icon'
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            width="20px"
            viewBox="0 0 24 24"
            strokeWidth={0}
            stroke="currentColor"
            opacity={0.85}
            onClick={handleClick}
        >
            <path id="upload_path"
                d="M 11.00,17.00
                    C 11.00,17.00 13.00,17.00 13.00,17.00
                        13.00,17.00 13.00,12.80 13.00,12.80
                        13.00,12.80 14.60,14.40 14.60,14.40
                        14.60,14.40 16.00,13.00 16.00,13.00
                        16.00,13.00 12.00,9.00 12.00,9.00
                        12.00,9.00 8.00,13.00 8.00,13.00
                        8.00,13.00 9.40,14.40 9.40,14.40
                        9.40,14.40 11.00,12.80 11.00,12.80
                        11.00,12.80 11.00,17.00 11.00,17.00 Z
                    M 4.00,20.00
                    C 3.45,20.00 2.98,19.80 2.59,19.41
                        2.20,19.02 2.00,18.55 2.00,18.00
                        2.00,18.00 2.00,6.00 2.00,6.00
                        2.00,5.45 2.20,4.98 2.59,4.59
                        2.98,4.20 3.45,4.00 4.00,4.00
                        4.00,4.00 10.00,4.00 10.00,4.00
                        10.00,4.00 12.00,6.00 12.00,6.00
                        12.00,6.00 20.00,6.00 20.00,6.00
                        20.55,6.00 21.02,6.20 21.41,6.59
                        21.80,6.98 22.00,7.45 22.00,8.00
                        22.00,8.00 22.00,18.00 22.00,18.00
                        22.00,18.55 21.80,19.02 21.41,19.41
                        21.02,19.80 20.55,20.00 20.00,20.00
                        20.00,20.00 4.00,20.00 4.00,20.00 Z
                    M 4.00,18.00
                    C 4.00,18.00 20.00,18.00 20.00,18.00
                        20.00,18.00 20.00,8.00 20.00,8.00
                        20.00,8.00 11.18,8.00 11.18,8.00
                        11.18,8.00 9.18,6.00 9.18,6.00
                        9.18,6.00 4.00,6.00 4.00,6.00
                        4.00,6.00 4.00,18.00 4.00,18.00 Z
                    M 4.00,18.00
                    C 4.00,18.00 4.00,6.00 4.00,6.00
                        4.00,6.00 4.00,18.00 4.00,18.00 Z" />
        </svg>
    );
}