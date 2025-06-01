import { Modal, App, Setting } from "obsidian";

import { IYWIPlugin } from '../../Main/IYWIPlugin'

export class UploadToSlugModal extends Modal {
    constructor(plugin: IYWIPlugin, onSubmit: (result: string) => void) {
        super(plugin.app);

        let slug: string = plugin.settings.data.vaultSlug

        this.setTitle('Введите директорию экспорта');
        new Setting(this.contentEl)
            .setName('Slug директории экспорта')
            .addText((text) =>
                text
                    .setValue(slug)
                    .onChange((value) => {
                        slug = value;
                    }));
        new Setting(this.contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText('Подтвердить')
                    .setCta()
                    .onClick(() => {
                        this.close();
                        onSubmit(slug);
                    }));
    }
}