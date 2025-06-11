
import { setTooltip } from 'obsidian';

import { createRef, JSX } from 'react';

import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { UploadButton } from './UploadButton';

import { ProgressBar } from './ProgressBar'


type NavHeaderProps = {
    children?: JSX.Element
    tooltip?: string
}

export const YWINavHeaderIcon = ({ children, tooltip }: NavHeaderProps) => {
    const iconRef = createRef<HTMLDivElement>()

    return <div
        ref={iconRef}
        style={{
            width: 30,
            height: 26,
            padding: "4px 6px",
            marginLeft: 4
        }}
        onMouseEnter={(e) => iconRef.current && tooltip ? setTooltip(iconRef.current, tooltip) : null}
        className='NavHeaderIcon'
    >
        {children}
    </div >
}

export const YWINavHeader = () => {
    return <div>
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: 8,
                marginTop: -4
            }}
        >
            <YWINavHeaderIcon tooltip='Войти' ><LoginButton /></YWINavHeaderIcon>
            <YWINavHeaderIcon tooltip='Выйти' ><LogoutButton /></YWINavHeaderIcon>
            <YWINavHeaderIcon tooltip='Экспортировать хранилище' ><UploadButton /></YWINavHeaderIcon>
        </div>

        <ProgressBar />
    </div>
}