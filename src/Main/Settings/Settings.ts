import { Notice, Plugin } from 'obsidian';
import { YWISessionGlobalProvider } from "../../Model/YWIContext"
import { defaultSettings } from './defaultSettings';


class SettingsData {
    vaultSlug: string = "";
    displayType: string = "";
    session: any = null;
    displayTitle: boolean = false;
    saveSession: boolean = false;
    exportFormats: string[] = ["md"];
    pathToBrowser: string = "";
}


export class YWISettings {
    private plugin: Plugin;
    public data: SettingsData


    constructor(plugin: Plugin) {
        this.plugin = plugin
    }


    private crushedDataNotice() {
        new Notice(`Файл 'data.json' повреждён и будет восстановлен до стандартных значений.`)
    }

    private firstLaunchNotice() {
        new Notice(
            `Видимо, вы запустили 'Yandex Wiki Integration' в первый раз.\n\nСпасибо за установку плагина!!!\n\nДля детальной информации, ознакомтесь с инструкцией.\n\nЕсли вы нашли ошибку - откройте, пожалуйста, Issue в github-е.`,
            15000
        )
    }

    private static isTypeOf<T>(jsonObject: Object, instanceType: { new(): T; }): boolean {
        try {
            // Check that all the properties of the JSON Object are also available in the Class.
            const instanceObject = new instanceType();
            for (let propertyName in instanceObject) {
                if (!jsonObject.hasOwnProperty(propertyName)) {
                    // If any property in instance object is missing then we have a mismatch.
                    return false;
                }
            }
            // All the properties are matching between object and the instance type.
            return true;
        } catch {
            return false;
        }
    };

    public async load() {
        let data = await this.plugin.loadData()

        if (!YWISettings.isTypeOf(data, SettingsData)) {
            if (data !== null) {
                this.crushedDataNotice()
            } else {
                this.firstLaunchNotice()
            }

            // await this.plugin.saveData(new SettingsData())
            await this.plugin.saveData(structuredClone(defaultSettings))
            data = await this.plugin.loadData()
        }

        this.data = data

        if (!(this.data.exportFormats instanceof Array) || this.data.exportFormats.length <= 0) {
            this.data.exportFormats = ["md"]
        }
    }

    public async save() {
        await this.plugin.saveData(this.data)
        this.plugin.app.vault.trigger("experience-third:save-settings")
    }

    public updateCSRF(csrf: string) {
        this.data.session.headers['x-csrf-token'] = csrf
        this.data.session.cookies['CSRF-TOKEN'] = csrf
    }

    public async registerSession(session: any, force: boolean = false) {
        YWISessionGlobalProvider.data = session

        if ((this.data.saveSession || force) && session !== null) {
            this.data.session = session;
            await this.save()
        }
    }

    public async setHomeSlug(slug: string[]) {
        this.data.vaultSlug = slug.join("/")
        await this.save()
    }

    public async deleteSession() {
        this.data.session = null;
        await this.save()
    }
}