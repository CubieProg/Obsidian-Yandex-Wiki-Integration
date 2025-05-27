

import { App, Plugin, PluginSettingTab, TextComponent } from 'obsidian';
import { YWISettings } from './Settings'
import * as obsidian from 'obsidian';



export class YWISettingsTab extends PluginSettingTab {
    plugin: Plugin
    settings: YWISettings

    constructor(plugin: Plugin, settings: YWISettings) {
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
