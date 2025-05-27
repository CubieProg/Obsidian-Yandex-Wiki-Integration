import { WorkspaceLeaf, TFile, ViewState, addIcon, Plugin } from 'obsidian';

import { YWISettings } from "./src/Main/Settings/Settings"
import { YWISettingsTab } from "./src/Main/Settings/SettingsTab"
import { YWIView } from "./src/Main/Components/YWIView"

// Нотация.
// 		YWI: Yandex Wiki Integration. Везде, где используется это сокращение, читать надо так.

class YWIPlugin extends Plugin {
	settings: YWISettings;

	static view_type_display_tab: string = "yandex-wiki-display-tab"

	private display_file: TFile
	private display_tab: WorkspaceLeaf

	async openYWPage(data: string) {
		const [
			display_tab,
			display_file
		] = await Promise.all([
			this.getOrCreateDisplayTab(),
			this.getOrCreateDisplayFile()
		]);

		if (display_tab == undefined) { return }

		await this.app.vault.modify(display_file, data);
		await display_tab.openFile(display_file)

		let state: ViewState = display_tab.getViewState();
		if (state.state !== undefined) { state.state.mode = 'preview' }
		display_tab.setViewState(state)
	}

	async closeYWPage(): Promise<void> {
		if (this.display_tab instanceof WorkspaceLeaf) {
			// this.display_tab.view.unload()
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
		// Ругается хуй пойми на что. Надо нормальную обёртку делать
		this.registerEvent(this.app.vault.on('yandex-wiki-integration:session-fetch', async (data: any) => {
			this.settings.registerSession(data)
		}));
		this.registerEvent(this.app.vault.on('yandex-wiki-integration:get-wiki-page', async (data: string) => {
			this.openYWPage(data)
		}));
	}

	private registerCommands() {
		this.addCommand({
			id: 'upload-vault',
			name: 'Upload Vault',
			callback: () => {
			}
		});
	}

	async onload() {
		addIcon('yandex-wiki-integration-icon',
			`<text x="40%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="currentColor" style="font: bold 56px sans-serif;">YW</text>  `);

		this.settings = new YWISettings(this)
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
		this.closeYWPage()
	}

	async activateView() {
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