

import { App, Plugin, PluginSettingTab, TextComponent } from 'obsidian';
import { RecentEditedNotesSettings } from './Settings'
import * as obsidian from 'obsidian';



export class RecentEditedNotesSettingTab extends PluginSettingTab {
    plugin: Plugin
    settings: RecentEditedNotesSettings

    constructor(plugin: Plugin, settings: RecentEditedNotesSettings) {
        super(plugin.app, plugin)
        this.plugin = plugin
        this.settings = settings
    }

    display() {
        let { containerEl } = this

        containerEl.empty()

        new obsidian.Setting(containerEl)
            .setName('List length')
            .setDesc('How long is your list of recently edited notes')
            .addText((text: TextComponent) =>
                text
                    .setValue(this.settings.data.listLength.toString())
                    .onChange(async (value: string) => {
                        this.settings.data.listLength = Number(value)
                        await this.settings.save()
                    })
            )
    }
}
