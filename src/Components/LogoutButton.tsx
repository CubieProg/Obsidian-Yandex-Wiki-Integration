import { useState, useContext } from 'react';
import { YwIContext } from "../Model/YWIContext"
import { Plugin } from 'obsidian';


type LoginButtonType = {
    plugin?: Plugin,
    onParentClick?: Function
    setOnParentClick?: Function
}


export const LogoutButton = () => {
    const [isRun, setIsRun] = useState(false);
    const context = useContext(YwIContext);


    const handleClick = async () => {
    };

    return (// у button был стиль. Удалил её только по этому
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
            <path id="logout_path"
                d="M 5.00,21.00
                    C 4.45,21.00 3.98,20.80 3.59,20.41
                        3.20,20.02 3.00,19.55 3.00,19.00
                        3.00,19.00 3.00,5.00 3.00,5.00
                        3.00,4.45 3.20,3.98 3.59,3.59
                        3.98,3.20 4.45,3.00 5.00,3.00
                        5.00,3.00 12.00,3.00 12.00,3.00
                        12.00,3.00 12.00,5.00 12.00,5.00
                        12.00,5.00 5.00,5.00 5.00,5.00
                        5.00,5.00 5.00,19.00 5.00,19.00
                        5.00,19.00 12.00,19.00 12.00,19.00
                        12.00,19.00 12.00,21.00 12.00,21.00
                        12.00,21.00 5.00,21.00 5.00,21.00 Z
                    M 16.00,17.00
                    C 16.00,17.00 14.62,15.55 14.62,15.55
                        14.62,15.55 17.18,13.00 17.18,13.00
                        17.18,13.00 9.00,13.00 9.00,13.00
                        9.00,13.00 9.00,11.00 9.00,11.00
                        9.00,11.00 17.18,11.00 17.18,11.00
                        17.18,11.00 14.62,8.45 14.62,8.45
                        14.62,8.45 16.00,7.00 16.00,7.00
                        16.00,7.00 21.00,12.00 21.00,12.00
                        21.00,12.00 16.00,17.00 16.00,17.00 Z" />
        </svg>
    );
}