import { WorkspaceLeaf, TFile, ViewState, addIcon, Plugin, Menu, MarkdownView } from 'obsidian';

import { YWISettings } from "./src/Main/Settings/Settings"
import { Commands } from './src/Main/Commands'
import { YWISettingsTab } from "./src/Main/Settings/SettingsTab"
import { YWIView } from "./src/Main/Components/YWIView"
import { IYWIPlugin } from './src/Main/IYWIPlugin';
import { uploadFile } from './src/Model/YWAPI/api';
import { TUploadTransaction } from './src/Model/YWAPI/UploadTransaction'

import { MainIconText } from './src/Main/Components/MainIcon'


// Нотация.
// 		YWI: Yandex Wiki Integration. Везде, где используется это сокращение, читать надо так.

class YWIPlugin extends Plugin implements IYWIPlugin {
	settings: YWISettings;

	static view_type_display_tab: string = "yandex-wiki-display-tab"

	private static YWFileNameMD: string = "Yandex Wiki Display File.md"

	private display_file: TFile

	private commands: Commands

	transaction: TUploadTransaction = {
		fileName: "",
		progress: 0.0
	}

	async onload() {
		addIcon('yandex-wiki-integration-icon', MainIconText);

		this.settings = new YWISettings(this)
		this.commands = new Commands(this)

		await this.settings.load()
		this.addSettingTab(new YWISettingsTab(this, this.settings))

		this.registerEvents()
		this.registerCommands()

		this.registerView(
			YWIView.view_type_ywi,
			(leaf) => new YWIView(leaf, this)
		)

		this.activateView()
	}

	async onunload(): Promise<void> {

	}

	private async openYWPage(data: any) {
		const [
			display_tab,
			display_file
		] = await Promise.all([
			this.getOrCreateDisplayTab(),
			this.getOrCreateDisplayFile()
		]);

		if (display_tab == undefined) { return }

		const str2disp = (this.settings.data.displayTitle ? `--- \n# ${data.title}\n --- \n` : ``) + (this.settings.data.displayType === 'Markdown' ? data.content : data.html)

		await this.app.vault.modify(display_file, str2disp);
		await display_tab.openFile(display_file)

		let state: ViewState = display_tab.getViewState();
		if (state.state !== undefined) { state.state.mode = 'preview' }
		display_tab.setViewState(state)
	}

	private async getOrCreateDisplayTab(): Promise<WorkspaceLeaf | undefined> {
		const leaves = this.app.workspace.getLeavesOfType(YWIPlugin.view_type_display_tab)
		if (leaves.length > 0) { return leaves[0] }

		const display_tab = this.app.workspace.getLeaf('tab')
		if (display_tab === null) { return }

		await display_tab.setViewState({ type: YWIPlugin.view_type_display_tab, active: true })
		return display_tab
	}

	private async getOrCreateDisplayFile(): Promise<TFile> {
		if (this.display_file instanceof TFile) { return this.display_file }

		const FunnyText = "### Страница рендера _страниц_ (ха-ха) из Yandex Wiki"
		let file = this.app.vault.getMarkdownFiles().find(file => file.name === YWIPlugin.YWFileNameMD)

		if (!file) {
			file = await this.app.vault.create(YWIPlugin.YWFileNameMD, FunnyText)
		}

		this.display_file = file
		return file
	}

	private registerEvents() {
		const eventsMap = new Map<string, Function>([
			["yandex-wiki-integration:session-fetch", async (data: any) => { this.settings.registerSession(data) }],
			["yandex-wiki-integration:get-wiki-page", async (data: any) => this.openYWPage(data)],
			["yandex-wiki-integration:set-home-slug", async (data: any) => this.settings.setHomeSlug(data)],
			["yandex-wiki-integration:upload", async (data: string[]) => uploadFile(data.join("/"), null, this)],
			["yandex-wiki-integration:upload-to-slug", async (slug: string) => uploadFile(slug, null, this)],
			["yandex-wiki-integration:upload-to-home", async (data: string[]) => uploadFile(this.settings.data.vaultSlug, null, this)],
			["yandex-wiki-integration:test", async (data: any) => { /*console.log(data)*/ }],
			["yandex-wiki-integration:logout", async (data: any) => this.settings.registerSession(undefined, true)]
		])

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu: Menu, file, source) => {
				menu.addSeparator()
				menu.addItem((item) => {
					item.setIcon("lucide-import")
						.setTitle(`YWI: Экспорт в Yandex Wiki`)
						.onClick((_) => {
							uploadFile(this.settings.data.vaultSlug, file, this)
						});
				});
			})
		);

		// Ругается хуй пойми на что. Надо нормальную обёртку делать
		// UPD: был какой-то заворачиватель из третьего плагина. 
		// 		Также, увидел, что интерфейс в апи обсидиана сделан только для обработки коллбэков с TFile
		eventsMap.forEach((callback, event_name) => {
			this.registerEvent(this.app.vault.on(event_name, async (data: any) => {
				await callback(data)
			}));
		})
	}

	private registerCommands() {
		this.commands = new Commands(this)
	}

	private async activateView() {
		const { workspace } = this.app

		let leaf = null
		const leaves = workspace.getLeavesOfType(YWIView.view_type_ywi)

		if (leaves.length > 0) {
			leaf = leaves[0]
		} else {
			leaf = workspace.getLeftLeaf(false)
			if (leaf === null) { return }
			await leaf.setViewState({ type: YWIView.view_type_ywi, active: true })
		}

		workspace.revealLeaf(leaf)
	}
}

module.exports = YWIPlugin