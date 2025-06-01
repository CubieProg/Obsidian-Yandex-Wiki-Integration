import { Plugin, PluginSettingTab, TextComponent, ToggleComponent } from 'obsidian';
import * as obsidian from 'obsidian';
import { useContext } from 'react';

import { YWISettings } from './Settings'
import { YWISessionGlobalProvider } from '../../Model/YWIContext'

export class YWISettingsTab extends PluginSettingTab {
    plugin: Plugin
    settings: YWISettings
    display_types: Array<string>

    constructor(plugin: Plugin, settings: YWISettings) {
        super(plugin.app, plugin)
        this.plugin = plugin
        this.settings = settings

        this.display_types = ['HTML', 'Markdown']
    }

    display() {
        let { containerEl } = this

        containerEl.empty()

        new obsidian.Setting(containerEl)
            .setName('Домашняя директория')
            .setDesc('Директория, куда будут выгружаться файлы из Obsidian в Yandex Wiki (Нужно указывать Slug)')
            .addText((text: TextComponent) =>
                text
                    .setValue(this.settings.data.vaultSlug.toString())
                    .onChange(async (value: string) => {
                        this.settings.data.vaultSlug = value
                        await this.settings.save()
                    })
            )

        new obsidian.Setting(containerEl)
            .setName('Форматы экспорта')
            .setDesc('Форматы, которые будут экспортироваться в Yandex Wiki. Форматы указываются без точек, через пробел. Пример: "md json txt"')
            .addText((text: TextComponent) => {
                try {
                    text.setValue(this.settings.data.exportFormats.join(" "))
                } catch {
                    text.setValue("md")
                }

                text.onChange(async (value: string) => {
                    this.settings.data.exportFormats = value.length > 0 ? value.split(" ") : []
                    await this.settings.save()
                })
            })

        new obsidian.Setting(containerEl)
            .setName('Режим отображения')
            .setDesc('Файлы из Yandex Wiki можно представлять в виде Markdown, а можно в виде HTML')
            .addDropdown(dropDown => {
                const default_value = this.display_types[0]
                const setting_value = this.settings.data.displayType.toString()

                this.display_types.forEach((type_str) => dropDown.addOption(type_str, type_str))

                dropDown.onChange(async (value) => {
                    this.settings.data.displayType = value
                    await this.settings.save()
                })

                dropDown.setValue(setting_value)
                if (dropDown.getValue() === "") {
                    console.error(`Нет типа отображения ${setting_value}. Поддерживаемые типы отображения:`, ...this.display_types)
                    dropDown.setValue(default_value)
                }
            });

        new obsidian.Setting(containerEl)
            .setName('Отображать название страницы')
            .setDesc('При открытии страницы в Yandex Wiki будет отображаться её название сверху')
            .addToggle((toggle: ToggleComponent) =>
                toggle
                    .setValue(this.settings.data.displayTitle)
                    .onChange(async (value: boolean) => {
                        this.settings.data.displayTitle = value
                        await this.settings.save()
                    })
            )

        new obsidian.Setting(containerEl)
            .setName('Сохранять сесию')
            .setDesc('Сессия в Yandex Wiki будет сохраняться в локальнных файлах')
            .addToggle((toggle: ToggleComponent) =>
                toggle
                    .setValue(this.settings.data.saveSession)
                    .onChange(async (value: boolean) => {
                        if (value) {
                            const session = YWISessionGlobalProvider.data
                            this.settings.registerSession(session, true)
                        } else {
                            this.settings.deleteSession()
                        }

                        this.settings.data.saveSession = value
                        await this.settings.save()
                    })
            )


        // const div = containerEl.createDiv()
        // div

        // new obsidian.Setting(containerEl).setDesc("Дорожная карта")
        // new obsidian.Setting(containerEl).setDesc("Известные проблемы")
        // new obsidian.Setting(containerEl).setDesc("Известные проблемы")
    }
}
