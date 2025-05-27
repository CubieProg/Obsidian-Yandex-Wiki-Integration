import { App, Plugin, PluginSettingTab, TextComponent } from 'obsidian';


export class RecentEditedNotesSettings {
    private plugin: Plugin;

    data: {
        listLength: number;
        session: any;
    }

    constructor(plugin: Plugin) {
        this.plugin = plugin
    }

    public async load() {
        const data = await this.plugin.loadData()

        console.log("Load Data")
        console.log(data)

        this.data = data

        console.log(this.data)

        // this.data.listLength = data.listLength
        // this.data.session = data.session
    }

    public async save() {
        console.log("Save Data")
        await this.plugin.saveData(this.data)
        this.plugin.app.vault.trigger("experience-third:save-settings")
    }


    public async registerSession(session: any) {
        this.data.session = session;
        await this.save()
    }
}