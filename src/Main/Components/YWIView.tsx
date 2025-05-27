import { Plugin, ItemView, WorkspaceLeaf } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { YWPannel } from "src/Components/YWPannel";

// const VIEW_TYPE_RECENT_EDITED_NOTES = 'recent-edited-notes-view-ts'
export class YWIView extends ItemView {
    static view_type_ywi: string = 'recent-edited-notes-view-ts'

    private plugin: Plugin;
    private update_events: Array<string>;
    private root: Root | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
        super(leaf)
        this.plugin = plugin
        this.update_events = [
            'modify',
            'rename',
            'experience-third:save-settings',
            'yandex-wiki-integration:session-fetch',
            'yandex-wiki-integration:get-wiki-page'
        ]
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

        this.root.render(
            <StrictMode>
                <YWPannel plugin={this.plugin} />
            </StrictMode>
        );
    }
}