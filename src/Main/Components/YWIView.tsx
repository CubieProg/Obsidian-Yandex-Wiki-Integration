import { Plugin, ItemView, WorkspaceLeaf } from "obsidian";
import { JSX, StrictMode, useContext } from "react";
import { Root, createRoot } from "react-dom/client";
import { YWPannel } from "src/Components/YWPannel";
import { IYWIPlugin } from '../IYWIPlugin'

// const VIEW_TYPE_RECENT_EDITED_NOTES = 'recent-edited-notes-view-ts'
export class YWIView extends ItemView {
    static view_type_ywi: string = 'recent-edited-notes-view-ts'

    private plugin: IYWIPlugin;
    private root: Root | null = null;
    private childs: JSX.Element;

    constructor(leaf: WorkspaceLeaf, plugin: IYWIPlugin) {
        super(leaf)
        this.plugin = plugin
    }

    getViewType() {
        return YWIView.view_type_ywi
    }

    getDisplayText() {
        return 'Yandex Wiki'
    }

    getIcon() {
        return "yandex-wiki-integration-icon"
    }

    async onOpen() {
        this.render()
    }

    render() {
        const svgLink = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=logout"

        const container = this.containerEl.children[1]
        this.root = createRoot(container);


        this.childs = <StrictMode>
            <YWPannel plugin={this.plugin} />
        </StrictMode>

        this.root.render(
            this.childs
        );
    }
}