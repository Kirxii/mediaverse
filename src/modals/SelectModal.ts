import type { App, ButtonComponent } from "obsidian"
import { Modal, Setting } from "obsidian"
import { SelectModalElement } from "./SelectModalElement"

export class SelectModal<T> extends Modal {
	isMultiSelectable: boolean

	title: string
	description: string

	elementWrapper: HTMLDivElement

	elements: T[]
	
	constructor(app: App, elements: T[], isMultiSelectable = true) {
		super(app)
		this.isMultiSelectable = isMultiSelectable

		this.title = ""
		this.description = ""

		this.elementWrapper = undefined

		this.elements = elements
	}

	async onOpen(): Promise<void> {
		const { contentEl, titleEl } = this

		titleEl.createEl("h1", { text: this.title })
		contentEl.addClass("mediaverse-select-modal")
		contentEl.createEL("p", { text: this.description })

		this.elementWrapper = contentEl.createDiv({ cls: "mediaverse-select-wrapper" })
		this.elementWrapper.tabIndex = 0

		let i = 0
		for (const element of this.elements) {
			const selectModalElement = new SelectModalElement(i, element, this.elementWrapper, this, false)

			this.selectModalElements.push(selectModalElement)

			this.renderElement(element, selectModalElement.element)

			i += 1
		}
	}
}
