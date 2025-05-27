import { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';

import { App, Plugin, PluginSettingTab, TextComponent } from 'obsidian';
import { addIcon } from 'obsidian';
import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import * as obsidian from 'obsidian';

import { RecentEditedNotesSettings } from "./src/Main/Settings/Settings"
import { YWPannel } from './src/Components/YWPannel'


const VIEW_TYPE_DISPALY_TAB = 'yandex-wiki-display-tab'

const pluginName = "experience-plugin-third-ts"

function getTopNFiles(plugin: Plugin, n: number) {
	const files = plugin.app.vault.getMarkdownFiles().sort(
		(f1, f2) => {
			return f2.stat.mtime - f1.stat.mtime
		}
	)

	return files.slice(0, n)
}


class RecentEditedNotesPlugin extends Plugin {
	settings: RecentEditedNotesSettings; //| null = null
	display_file: TFile
	display_tab: WorkspaceLeaf


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

		let state: obsidian.ViewState = display_tab.getViewState();
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
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_DISPALY_TAB)

		let display_tab;

		if (leaves.length > 0) {
			display_tab = leaves[0]
		} else {
			display_tab = this.app.workspace.getLeaf('tab')
			if (display_tab === null) {
				return
			}
			await display_tab.setViewState({ type: VIEW_TYPE_DISPALY_TAB, active: true })
		}

		this.display_tab = display_tab

		return display_tab
	}

	private async getOrCreateDisplayFile(): Promise<TFile> {
		const YWFileNameMD = "Yandex Wiki Display File.md"
		const FunnyText = "### Страница рендера _страниц_ (ха-ха) из Yandex Wiki"
		let file = this.app.vault.getMarkdownFiles().find(file => file.name === YWFileNameMD)

		if (!file) {
			file = await this.app.vault.create(YWFileNameMD, FunnyText)
		}

		return file
	}

	async onload() {

		addIcon('yandex-wiki-integration-icon',
			`<text x="40%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="currentColor" style="font: bold 56px sans-serif;">YW</text>  `);
		const data = await this.loadData()
		await this.loadSettings(data)


		this.addCommand({
			id: 'upload-vault',
			name: 'Upload Vault',
			callback: () => {
			}
		});

		this.addSettingTab(new RecentEditedNotesSettingTab(this.app, this))

		this.registerView(
			VIEW_TYPE_RECENT_EDITED_NOTES,
			(leaf) => new RecentEditedNotesView(leaf, this)

		)
		this.activateView()
	}

	async onunload(): Promise<void> {
		this.closeYWPage()
	}


	async loadSettings(data: any) {
		this.settings = new RecentEditedNotesSettings(data)
	}

	async saveSettings() {
		await this.saveData(this.settings)
		this.app.vault.trigger("experience-third:save-settings")
	}

	async activateView() {
		const { workspace } = this.app

		let leaf = null
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_RECENT_EDITED_NOTES)

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0]
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
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
class RecentEditedNotesView extends ItemView {

	plugin: RecentEditedNotesPlugin;
	update_events: Array<string>;
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: RecentEditedNotesPlugin) {
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
			this.plugin.settings.session = data
			await this.plugin.saveSettings()
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

	update() {
		const container = this.containerEl.children[1]
		container.empty()

		container.createEl('h4', { text: `Top-${this.plugin.settings?.listLength} recent edited notes` })

		const files = getTopNFiles(this.plugin, this.plugin.settings?.listLength)
		const ul = container.createEl('ul')

		for (const file of files) {
			const li = ul.createEl('li')
			const link = li.createEl('a', { text: file.basename })

			link.addEventListener("click", (event) => {
				event.preventDefault() // Prevent default link behavior
				this.app.workspace.openLinkText(file.path, "", false) // Open the note
			})
		}
	}
}


class RecentEditedNotesSettingTab extends PluginSettingTab {
	plugin: RecentEditedNotesPlugin

	constructor(app: App, plugin: RecentEditedNotesPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display() {
		let { containerEl } = this

		containerEl.empty()

		new obsidian.Setting(containerEl)
			.setName('List length')
			.setDesc('How long is your list of recently edited notes')
			.addText((text: TextComponent) =>
				text
					.setValue(this.plugin.settings.listLength.toString())
					.onChange(async (value: string) => {
						this.plugin.settings.listLength = Number(value)
						await this.plugin.saveSettings()
					})
			)
	}
}

module.exports = RecentEditedNotesPlugin
