import { JSX } from 'react';

import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { UploadButton } from './UploadButton';

import { ProgressBar } from './ProgressBar'

type Props = {
    children?: string | JSX.Element | JSX.Element[]
}

export const YWINavHeaderIcon = ({ children }: Props) => {
    return <div
        style={{
            width: 30,
            height: 26,
            padding: "4px 6px",
            marginLeft: 4
        }}
        className='NavHeaderIcon'
    >
        {children}
    </div>
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
            <YWINavHeaderIcon ><LoginButton /></YWINavHeaderIcon>
            <YWINavHeaderIcon ><LogoutButton /></YWINavHeaderIcon>
            <YWINavHeaderIcon ><UploadButton /></YWINavHeaderIcon>
        </div>

        <ProgressBar />
    </div>

}
