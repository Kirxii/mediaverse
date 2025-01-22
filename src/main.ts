import { App, Setting, Notice, Modal, Plugin } from "obsidian";
import { AniListAPI } from "./api/AniList"
import { SelectModalElement } from "./modals/SelectModalElement"
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
					const query = new AniListAPI().searchByTitle(title)
					onSubmit(query)
				}),
		);
	}
}

export class simpleModal extends Modal {
	constructor(app: App, elements: object[]) {
		super(app);
		this.elements = elements
	}

	async onOpen(): Promise<void> {
		const { contentEl, titleEl } = this

		titleEl.createEl("h3", { text: "Result Modal" })
		contentEl.classList.add("result-modal-test")
		
		const wrapper = contentEl.createDiv({ cls: "result-modal-test-wrapper" })
		
		let i = 0
		for (const element of this.elements) {
			const selectModalElement = new SelectModalElement(i, element, wrapper, this, false)
			
			selectModalElement.element.createEl("div", { text: element.title.native })
			selectModalElement.element.createEl("small", { text: element.id })

			i += 1
		}
	}
}

export default class AniList_API extends Plugin {
	async onload() {
		this.addCommand({
			id: "ani-simple-query",
			name: "Simple query",
			callback: () => {
				new simpleQueryModal(this.app, result => {
					result.then((value) => {
						new simpleModal(this.app, value).open()
					})
				}).open()
				
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
