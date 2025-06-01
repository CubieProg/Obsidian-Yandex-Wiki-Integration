import { Modal, App, Setting } from "obsidian";

import { IYWIPlugin } from '../../Main/IYWIPlugin'

export class DisplayTypeModal extends Modal {
    private display_types: string[]

    constructor(plugin: IYWIPlugin, onSubmit: (result: string) => void) {
        super(plugin.app);
        this.display_types = ['HTML', 'Markdown']

        let display_type: string = plugin.settings.data.displayType

        this.setTitle('Выберете режим отображения');
        new Setting(this.contentEl)
            .setName('Режим отображения')
            .addDropdown(dropDown => {
                this.display_types.forEach((type_str) => dropDown.addOption(type_str, type_str))
                dropDown.setValue(display_type)

                dropDown.onChange(async (value) => {
                    display_type = value
                })
            })
        new Setting(this.contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText('Подтвердить')
                    .setCta()
                    .onClick(() => {
                        this.close();
                        onSubmit(display_type);
                    }));
    }
}