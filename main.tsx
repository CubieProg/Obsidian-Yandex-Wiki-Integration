import { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';

import { ItemView, WorkspaceLeaf, TFile, ViewState, addIcon, Plugin } from 'obsidian';

import { RecentEditedNotesSettings } from "./src/Main/Settings/Settings"
import { RecentEditedNotesSettingTabN } from "./src/Main/Settings/SettingsTab"

import { YWPannel } from './src/Components/YWPannel'



const pluginName = "experience-plugin-third-ts"

class YWIPlugin extends Plugin {
	settings: RecentEditedNotesSettings;

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

	async onload() {

		addIcon('yandex-wiki-integration-icon',
			`<text x="40%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="currentColor" style="font: bold 56px sans-serif;">YW</text>  `);

		this.settings = new RecentEditedNotesSettings(this)
		await this.settings.load()


		this.addCommand({
			id: 'upload-vault',
			name: 'Upload Vault',
			callback: () => {
			}
		});

		// this.addSettingTab(new RecentEditedNotesSettingTab(this.app, this))

		this.addSettingTab(new RecentEditedNotesSettingTabN(this, this.settings))

		this.registerView(
			VIEW_TYPE_RECENT_EDITED_NOTES,
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
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_RECENT_EDITED_NOTES)

		if (leaves.length > 0) {
			leaf = leaves[0]
		} else {
			leaf = workspace.getLeftLeaf(false)
			if (leaf === null) {
				return
			}
			await leaf.setViewState({ type: VIEW_TYPE_RECENT_EDITED_NOTES, active: true })
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf)
	}
}



const VIEW_TYPE_RECENT_EDITED_NOTES = 'recent-edited-notes-view-ts'
class YWIView extends ItemView {

	plugin: YWIPlugin;
	update_events: Array<string>;
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: YWIPlugin) {
		super(leaf)
		this.plugin = plugin
		this.update_events = [
			'modify',
			'rename',
			'experience-third:save-settings',
			'yandex-wiki-integration:session-fetch',
			'yandex-wiki-integration:get-wiki-page'
		]

	}

	getViewType() {
		return VIEW_TYPE_RECENT_EDITED_NOTES
	}

	getDisplayText() {
		return 'Yandex Wiki'
	}

	getIcon() {
		return "yandex-wiki-integration-icon"
	}

	async onOpen() {
		// Ругается хуй пойми на что. Надо нормальную обёртку делать
		this.registerEvent(this.app.vault.on('yandex-wiki-integration:session-fetch', async (data) => {
			this.plugin.settings.registerSession(data)
		}));
		this.registerEvent(this.app.vault.on('yandex-wiki-integration:get-wiki-page', async (data: string) => {
			this.plugin.openYWPage(data)
		}));

		this.render()
	}

	render() {
		const svgLink = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=logout"

		const container = this.containerEl.children[1]
		this.root = createRoot(container);

		this.root.render(
			<StrictMode>
				<YWPannel plugin={this.plugin} />
			</StrictMode>
		);
	}
}

module.exports = YWIPlugin
