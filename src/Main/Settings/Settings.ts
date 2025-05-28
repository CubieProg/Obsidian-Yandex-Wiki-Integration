import { Plugin } from 'obsidian';
import { YWISessionGlobalProvider } from "../../Model/YWIContext"

export class YWISettings {
    private plugin: Plugin;

    data: {
        listLength: number;
        vaultSlug: string;
        displayType: string;
        session: any;
        displayTitle: boolean;
        saveSession: boolean;
    }

    constructor(plugin: Plugin) {
        this.plugin = plugin
    }

    public async load() {
        const data = await this.plugin.loadData()
        this.data = data
    }

    public async save() {
        await this.plugin.saveData(this.data)
        this.plugin.app.vault.trigger("experience-third:save-settings")
    }

    public async registerSession(session: any, force: boolean = false) {
        YWISessionGlobalProvider.data = session

        if ((this.data.saveSession || force) && session != null) {
            this.data.session = session;
            await this.save()
        }
    }

    public async deleteSession() {
        this.data.session = null;
        await this.save()
    }
}