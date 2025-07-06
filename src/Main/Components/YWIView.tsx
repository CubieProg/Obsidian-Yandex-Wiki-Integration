import { Plugin, ItemView, WorkspaceLeaf, Menu, setTooltip } from "obsidian";
import { JSX, StrictMode, useContext } from "react";
import { Root, createRoot } from "react-dom/client";
import { YWIPannel } from "src/Components/YWIPannel";
import { IYWIPlugin } from '../IYWIPlugin'

// const VIEW_TYPE_RECENT_EDITED_NOTES = 'recent-edited-notes-view-ts'
export class YWIView extends ItemView {
    static view_type_ywi: string = 'yandex-wiki_integration-view'

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
        return 'Yandex wiki integration'
    }

    getIcon() {
        return "yandex-wiki-integration-icon"
    }

    async onOpen() {        
        this.render()
    }

    render() {
        const container = this.containerEl.children[1]

        this.root = createRoot(container);

        this.childs = <StrictMode>
            <YWIPannel plugin={this.plugin} parentView={this} />
        </StrictMode>

        this.root.render(
            this.childs
        );
    }
}