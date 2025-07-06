

import { IYWIPlugin } from './IYWIPlugin'
import { Notice, Plugin } from 'obsidian'


import { ExportFormatsModal } from '../Components/Modals/ExportFormatsModal'
import { DisplayTypeModal } from '../Components/Modals/DisplayTypeModal'
import { UploadToSlugModal } from '../Components/Modals/UploadToSlugModal'

export class Commands {
    private commands: Map<string, Function> = new Map<string, Function>([
        // ["Login", async () => { }],
        // ["Upload Directory", async () => { }],
        // ["Upload Directory to Slug", async () => { }],

        ["Logout", async () => {
            this.plugin.app.vault.trigger("yandex-wiki-integration:logout")

            new Notice(`YWI: Вы вышли из YWI`)
        }],

        ["Upload vault", async () => {
            this.plugin.app.vault.trigger("yandex-wiki-integration:upload-to-home")
        }],

        ["Upload vault to slug", async () => {
            new UploadToSlugModal(this.plugin, async (slug: string) => {
                this.plugin.app.vault.trigger("yandex-wiki-integration:upload-to-slug", slug)
            })
        }],

        ["Set display type", async () => {
            new DisplayTypeModal(this.plugin, async (result) => {
                this.plugin.settings.data.displayType = result
                await this.plugin.settings.save()

                new Notice(`YWI: Режим отображения: ${result}`)
            }).open();
        }],

        ["Set export formats", async () => {
            new ExportFormatsModal(this.plugin, async (result) => {
                this.plugin.settings.data.exportFormats = result.split(" ")
                await this.plugin.settings.save()

                new Notice(`YWI: Форматы экспорта: ${result}`)
            }).open();
        }],

        ["Toggle save session", async () => {
            this.plugin.settings.data.saveSession = !this.plugin.settings.data.saveSession
            this.plugin.settings.registerSession(this.plugin.settings.data.saveSession, true)
            await this.plugin.settings.save()

            const noticeMessage: string = this.plugin.settings.data.saveSession ?
                "Сессия будет сохраняться" :
                "Сессия не будет сохраняться"
            new Notice(`YWI: ${noticeMessage}`)
        }],

        ["Toggle display titles", async () => {
            this.plugin.settings.data.displayTitle = !this.plugin.settings.data.displayTitle
            await this.plugin.settings.save()

            const noticeMessage: string = this.plugin.settings.data.displayTitle ?
                "Заголовки страниц отображаются" :
                "Заголовки страниц не отображаются"
            new Notice(`YWI: ${noticeMessage}`)
        }]
    ])

    private plugin: IYWIPlugin

    constructor(plugin: IYWIPlugin) {
        this.plugin = plugin
        this.registerCommands()
    }

    private getCommandId(command: string) {
        return command.toLowerCase().replace(" ", "-")
    }

    public registerCommands() {
        this.commands.forEach((callback, command_name) => {
            this.plugin.addCommand(
                {
                    name: command_name,
                    id: this.getCommandId(command_name),
                    callback: async () => {
                        await callback()
                    }
                }
            )
        });
    }
}