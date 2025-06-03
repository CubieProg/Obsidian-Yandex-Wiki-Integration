
import { displayTooltip } from 'obsidian';

import { JSX, useContext } from 'react';

import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { UploadButton } from './UploadButton';

import { ProgressBar } from './ProgressBar'
import { YwIContext } from 'src/Model/YWIContext';


function showTooltip(e: React.MouseEvent<HTMLElement, MouseEvent>, container: HTMLElement, text: string | null | undefined) {
    if (typeof text !== 'string' || text.length <= 0) { return }
    try {
        container.getBoundingClientRect()
    } catch { return }
    const rect = container.getBoundingClientRect()

    let div = container.createEl('div');
    div.id = `custom-tooltip-id-${text}`
    div.className = `custom-tooltip-id-${text}`

    div.style.position = "absolute"
    div.style.left = (e.clientX - rect.x) + "px"
    div.style.top = (e.clientY - rect.y) + "px"
    
    container.appendChild(div);
    displayTooltip(div, text, { delay: 400 })
}

function closeTooltip(e: React.MouseEvent<HTMLElement, MouseEvent>, container: HTMLElement, text: string | null | undefined) {
    const tooltip = container.getElementsByClassName(`custom-tooltip-id-${text}`)

    Array.prototype.forEach.call(tooltip, (el: HTMLElement) => {
        // el.style.setProperty("display", "none")
        el.parentNode?.removeChild(el);
    });

}

type NavHeaderProps = {
    children?: JSX.Element
    tooltip?: string
}

export const YWINavHeaderIcon = ({ children, tooltip }: NavHeaderProps) => {
    const { parentView } = useContext(YwIContext)

    return <div
        style={{
            width: 30,
            height: 26,
            padding: "4px 6px",
            marginLeft: 4
        }}

        className='NavHeaderIcon'
        onMouseEnter={(e) => { showTooltip(e, parentView.containerEl, tooltip) }}
        onMouseLeave={(e) => { closeTooltip(e, parentView.containerEl, tooltip) }}
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
