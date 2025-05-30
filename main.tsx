import { WorkspaceLeaf, TFile, ViewState, addIcon, Plugin, Menu, getIconIds, Notice } from 'obsidian';

import { YWISettings } from "./src/Main/Settings/Settings"
import { YWISettingsTab } from "./src/Main/Settings/SettingsTab"
import { YWIView } from "./src/Main/Components/YWIView"
import { IYWIPlugin } from './src/Main/IYWIPlugin';
import { uploadFile } from './src/Model/YWAPI/api';
import { TUploadTransaction } from './src/Model/YWAPI/UploadTransaction'


// Нотация.
// 		YWI: Yandex Wiki Integration. Везде, где используется это сокращение, читать надо так.

class YWIPlugin extends Plugin implements IYWIPlugin {
	settings: YWISettings;

	static view_type_display_tab: string = "yandex-wiki-display-tab"

	private display_file: TFile
	private display_tab: WorkspaceLeaf

	transaction: TUploadTransaction = {
		fileName: "",
		progress: 0.0
	}

	trc = 0.0

	trcF() {
		this.trc += 1.15
	}

	async onload() {
		addIcon('yandex-wiki-integration-icon',
			`<text x="40%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="currentColor" style="font: bold 56px sans-serif;">YW</text>  `);


		// console.log(getIconIds())
		this.settings = new YWISettings(this)
		await this.settings.load()
		this.addSettingTab(new YWISettingsTab(this, this.settings))

		this.registerEvents()
		this.registerCommands()

		this.registerView(
			YWIView.view_type_ywi,
			(leaf) => new YWIView(leaf, this)
		)

		// uploadFile(this.settings.data.vaultSlug.split("/"), "Academic English", this)


		this.activateView()
	}

	async onunload(): Promise<void> {
		this.closeYWPage()
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

		// let str2disp = this.settings.data.displayType === 'Markdown' ? data.content : data.html
		// str2disp = `--- \n# ${data.title}\n --- \n` + str2disp

		const str2disp = (this.settings.data.displayTitle ? `--- \n# ${data.title}\n --- \n` : ``) + (this.settings.data.displayType === 'Markdown' ? data.content : data.html)

		await this.app.vault.modify(display_file, str2disp);
		await display_tab.openFile(display_file)

		let state: ViewState = display_tab.getViewState();
		if (state.state !== undefined) { state.state.mode = 'preview' }
		display_tab.setViewState(state)
	}

	private async closeYWPage(): Promise<void> {
		if (this.display_tab instanceof WorkspaceLeaf) {
			this.display_tab.detach()
		}
	}

	private async getOrCreateDisplayTab(): Promise<WorkspaceLeaf | undefined> {
		if (this.display_tab instanceof WorkspaceLeaf) {
			return this.display_tab
		}
		const leaves = this.app.workspace.getLeavesOfType(YWIPlugin.view_type_display_tab)

		let display_tab;

		if (leaves.length > 0) {
			display_tab = leaves[0]
		} else {
			display_tab = this.app.workspace.getLeaf('tab')
			if (display_tab === null) {
				return
			}
			await display_tab.setViewState({ type: YWIPlugin.view_type_display_tab, active: true })
		}

		this.display_tab = display_tab

		return display_tab
	}

	private async getOrCreateDisplayFile(): Promise<TFile> {
		if (this.display_file instanceof TFile) { return this.display_file }

		const YWFileNameMD = "Yandex Wiki Display File.md"
		const FunnyText = "### Страница рендера _страниц_ (ха-ха) из Yandex Wiki"
		let file = this.app.vault.getMarkdownFiles().find(file => file.name === YWFileNameMD)

		if (!file) {
			file = await this.app.vault.create(YWFileNameMD, FunnyText)
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
			["yandex-wiki-integration:upload-to-home", async (data: string[]) => uploadFile(this.settings.data.vaultSlug, null, this)],
			["yandex-wiki-integration:test", async (data: any) => {console.log(data)}]
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
		this.addCommand({
			id: 'upload-vault',
			name: 'Upload Vault',
			callback: () => {
			}
		});
	}

	private async activateView() {
		const { workspace } = this.app

		let leaf = null
		const leaves = workspace.getLeavesOfType(YWIView.view_type_ywi)

		if (leaves.length > 0) {
			leaf = leaves[0]
		} else {
			leaf = workspace.getLeftLeaf(false)
			if (leaf === null) {
				return
			}
			await leaf.setViewState({ type: YWIView.view_type_ywi, active: true })
		}

		workspace.revealLeaf(leaf)
	}
}

// Нельзя пихуйнуть в `export class YWIPlugin`. Obsidian его тупо не загрузит. Или нужно копаться, но пофиг
module.exports = YWIPlugin