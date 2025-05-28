import { WorkspaceLeaf, TFile, ViewState, addIcon, Plugin, Menu, getIconIds, setIcon, ItemView } from 'obsidian';
import { JSX, ReactElement, StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { renderToStaticMarkup } from "react-dom/server"
import { YWIView } from 'src/Main/Components/YWIView';
import { YWPannel } from './YWPannel';

import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { UploadButton } from './UploadButton';



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
    // onClick={()=>{children.onClick}}
    >
        {children}
    </div>
}

export const YWINavHeader = () => {

    return <div
        style={{
            // margin: "4px auto",
            // padding: 8, // Контейнер уже имеет отступы
            // position: "relative",
            display: "flex",
            justifyContent: "center",
            paddingBottom: 8,
            marginTop: -4
        }}
    >
        {/* <div
            style={{
                width: 100,
                height: 100,
                background: "red",
                borderColor: "black",
                borderWidth: 2
            }}
        ></div> */}
        <YWINavHeaderIcon ><LoginButton /></YWINavHeaderIcon>
        <YWINavHeaderIcon ><LogoutButton /></YWINavHeaderIcon>
        <YWINavHeaderIcon ><UploadButton /></YWINavHeaderIcon>
    </div>

    // setIcon(container, "lucide-home")

    // return container

    // const output = document.createElement('p')
    // const staticElement = renderToStaticMarkup(container)
    // output.innerHTML = staticElement

    // setIcon(output, "lucide-home")

    // return output

    // (
    //     <div className="Container" dangerouslySetInnerHTML={{ __html: someHtml }}></div>
    // )
}

// export class YWINavHeader extends ItemView {
//     static view_type_ywi_nav_header: string = 'ywi-nav-header-view'

//     private root: Root | null = null;
//     private childs: JSX.Element;

//     constructor(leaf: WorkspaceLeaf) {
//         super(leaf)
//     }

//     getViewType() {
//         return YWINavHeader.view_type_ywi_nav_header
//     }

//     getDisplayText() {
//         return 'Yandex Wiki'
//     }

//     getIcon() {
//         return "yandex-wiki-integration-icon"
//     }

//     async onOpen() {
//         this.render()
//     }

//     render() {
//         const container = this.containerEl.children[1]

//         // const inner = container.createEl('div', { text: `Top-${123} recent edited notes` })
//         const inner = container.createEl('div')

//         setIcon(inner, "lucide-home")

//         this.root = createRoot(container);




//         this.childs = <StrictMode>
//         </StrictMode>

//         this.root.render(
//             this.childs
//         );





//         // this.root.render()

//         // setIcon(container, "lucide-home")


//         // // this.childs =

//         // this.root.render(
//         //     this.childs
//         // );


//         // const container = <div
//         //     style={{
//         //         padding: 8
//         //     }}
//         // >

//         // </div>

//         // const output = document.createElement('p')
//         // const staticElement = renderToStaticMarkup(container)
//         // output.innerHTML = staticElement

//         // setIcon(output, "lucide-home")

//         return
//     }
// }



// import { Plugin, ItemView, WorkspaceLeaf } from "obsidian";
// import { JSX, StrictMode, useContext } from "react";
// import { Root, createRoot } from "react-dom/client";


// // const VIEW_TYPE_RECENT_EDITED_NOTES = 'recent-edited-notes-view-ts'
// export class YWINavHeader extends ItemView {
//     static view_type_ywi: string = 'recent-edited-notes-view-ts'

//     private root: Root | null = null;
//     private childs: JSX.Element;

//     constructor(leaf: WorkspaceLeaf) {
//         super(leaf)
//     }

//     getViewType() {
//         return YWINavHeader.view_type_ywi
//     }

//     getDisplayText() {
//         return 'Yandex Wiki'
//     }

//     getIcon() {
//         return "yandex-wiki-integration-icon"
//     }

//     async onOpen() {
//         this.render()
//     }

//     render() {
//         const svgLink = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=logout"

//         const container = this.containerEl.children[1]
//         this.root = createRoot(container);

//         this.childs = <StrictMode>
//         </StrictMode>

//         this.root.render(
//             this.childs
//         );
//     }
// }