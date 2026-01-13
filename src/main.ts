import { App, Editor, MarkdownView, Modal, Notice, Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SampleSettingTab,
} from "./settings";
import { MediaverseQueryModal } from "modals/QueryModal";
import { AniListAPI } from "apis/AniListAPI";

export default class Mediaverse extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: "mediaverse-query-modal",
			name: "Open query modal",
			callback: () => {
				new MediaverseQueryModal(this, {}).open();
			},
		});
		this.addCommand({
			id: "mediaverse-anilist-api",
			name: "Anilist API",
			callback: async () => {
				const data = await new AniListAPI().searchByTitle(
					"Boku no hero academia",
				);
				console.log(data);
			},
		});
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
