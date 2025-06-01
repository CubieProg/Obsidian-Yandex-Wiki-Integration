import { Modal, App, Setting } from "obsidian";

import { IYWIPlugin } from '../../Main/IYWIPlugin'

export class ExportFormatsModal extends Modal {
    constructor(plugin: IYWIPlugin, onSubmit: (result: string) => void) {
        super(plugin.app);

        let export_formats: string = plugin.settings.data.exportFormats.join(" ");

        this.setTitle('Введите форматы');
        new Setting(this.contentEl)
            .setName('Форматы экспорта')
            .addText((text) =>
                text
                    .setValue(export_formats)
                    .onChange((value) => {
                        export_formats = value;
                    }));
        new Setting(this.contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText('Подтвердить')
                    .setCta()
                    .onClick(() => {
                        this.close();
                        onSubmit(export_formats);
                    }));
    }
}