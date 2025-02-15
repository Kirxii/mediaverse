import { App, Setting, Notice, Modal, Plugin } from "obsidian";
import { setTooltip } from "obsidian"
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
	private resolvePromise: (result: string) => void
	
	constructor(app: App) {
		super(app);
		this.setTitle("AniList");
	}

	openWithPromise(): Promise<object[]> {
		return new Promise((resolve) => {
			this.resolvePromise = resolve
			this.open()
		})
	}

	onOpen() {
		const { contentEl } = this

		let title: string
		
		new Setting(contentEl)
			.setName("Name")
			.addText((text) =>
				text.onChange((value) => {
					title = value
				}),
			);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(async () => {
					const query = await new AniListAPI().searchByTitle(title)
					this.resolvePromise(query)
					this.close()
				}),
		);
	}

	onClose() {
		const { contentEl } = this
		contentEl.empty()
	}
}

export class simpleResultModal extends Modal {
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
			const selectModalElement = new SelectModalElement(i, element, wrapper, this, false).element
			
			const coverImage: HTMLDivElement = selectModalElement.createDiv({ cls: "cover-image-wrapper" })
			coverImage.createEl("img", { cls: "cover-image", attr: { src: element.coverImage.extraLarge } })
			
			const primary_title: HTMLDivElement = selectModalElement.createEl("div", { text: element.title.native, cls: "primary-title" })
			const secondary_title: HTMLDivElement = selectModalElement.createEl("div", { text: element.title.english ?? element.title.romaji, cls: "secondary-title" })
			const _id: HTMLDivElement = selectModalElement.createEl("small", { text: element.id, cls: "id" })

			setTooltip(primary_title, element.title.native, { delay: 100, placement: "bottom" })
			setTooltip(secondary_title, element.title.english ?? element.title.romaji, { delay: 100, placement: "bottom" })
			
			i += 1
		}
	}
}

export default class AniList_API extends Plugin {
	async onload() {
		this.addCommand({
			id: "ani-simple-query",
			name: "Simple query",
			callback: async () => {
				const modal = new simpleQueryModal(this.app)
				const result = await modal.openWithPromise()
				new simpleResultModal(this.app, result).open()
				
				/* new simpleQueryModal(this.app, result => {
					result.then((value) => {
						new simpleResultModal(this.app, value).open()
					})
				}).open() */
				
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
