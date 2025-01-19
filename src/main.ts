import { App, Setting, Notice, Modal, Plugin } from "obsidian";
import { AniListAPI } from "./api/AniList"
import type { mediaSource } from "./api/AniList"

interface simpleQueryOutput {
	id: number,
	title: {
		romaji: string,
		english: string,
		native: string
	}
};

export class simpleSelect {
	constructor(containerEl: HTMLElement) {
		this.addOption("minimize", "Maximize")
	}
}

export class simpleQueryModal extends Modal {
	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.setTitle("AniList");

		let title: string;
		let output: simpleQueryOutput;

		new Setting(this.contentEl).setName("Name").addText((text) =>
			text.onChange((value) => {
				title = value
			}),
		);

		new Setting(this.contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					const query = `
					query ($search: String!) {
						Page {
							media(search: $search, type: ANIME) {
								id
								title {
									romaji
									english
									native
								}
							}
						}
					}
					`

					let variables = {
						search: title
					}

					const url = "https://graphql.anilist.co"
						let options = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Accept": "application/json",
						},
						body: JSON.stringify({
							query: query,
							variables: variables,
						}),
					}

					fetch(url, options).then(handleResponse).then(handleData)

					function handleResponse(response) {
						return response.json().then(json => {
							return response.ok ? json : Promise.reject(json)
						})
					}

					function handleData(data: Response) {
						output = data.data.Page.media[0]
						onSubmit(output);
					}
				}),
		);
	}
}

export class simpleModal extends Modal {
	constructor(app: App) {
		super(app);
		this.setTitle("AniList");

		new Setting(this.contentEl).addDropdown(dropdown => {
			dropdown
			.addOption("minimize", "Minimized")
		})
	}
}

export default class AniList_API extends Plugin {
	async onload() {
		this.addCommand({
			id: "ani-simple-query",
			name: "Simple query",
			callback: () => {
				new AniListAPI().searchByTitle("Boku no hero academia")
				
				/* new simpleQueryModal(this.app, result => {
					const noticeOutput = `
						id: ${result.id}
						title:
							romaji: ${result.title.romaji}
							english: ${result.title.english}
							native: ${result.title.native}
					`.split("\n")
					 .map(s => s.trim())
					 .join("\n");
					new Notice(noticeOutput)
				}).open() */
			},
		});
	}

	async onunload() {
		new Notice("AniList unloaded");
	}
}
