import type { SelectModal } from "./SelectModal"

export class SelectModalElement<T> {
	selectModal: SelectModal<T>
	value: T
	readonly id: number
	element: HTMLDivElement
	cssClass: string
	hoveredClass: string
	selectedClass: string
	private active: boolean
	private highlighted: boolean

	constructor (id: number, value: T, parentElement: HTMLElement, selectModal: SelectModal<T>, selected: boolean = false) {
		this.id = id
		this.value = value
		this.selected = selected
		this.selectModal = selectModal

		this.cssClass = "mediaverse-select-modal-element"
		this.hoveredClass = "mediaverse-select-modal-element-hovered"
		this.selectedClass = "mediaverse-select-modal-element-selected"

		this.element = parentElement.createDiv({ cls: this.cssClass })
		this.element.id = this.getHTMLId()
		this.element.on("click", `#${this.getHTMLId()}`, () => {
			this.setSelected(!this.selected)
		})
		this.element.on("mouseenter", `#${this.getHTMLId()}`, () => {
			this.setHovered(true)
		})
		this.element.on("mouseleave", `#${this.getHTMLId()}`, () => {
			this.setHovered(false)
		})

		this.hovered = false
	}

	getHTMLId(): string {
		return `mediaverse-select-modal-element-${this.id}`
	}

	isHovered(): boolean {
		return this.hovered
	}

	setHovered(value: boolean): void {
		this.hovered = value
		if (this.hovered) {
			this.addClass(this.hoveredClass)
		} else {
			this.removeClass(this.hoveredClass)
		}
	}

	isSelected() {
		return this.selected
	}

	setSelected(value: boolean): void {
		this.selected = value
		if (this.selected) {
			this.addClass(this.selectedClass)
		} else {
			this.removeClass(this.selectedClass)
		}
	}

	addClass(cssClass: string): void {
		this.element.classList.add(cssClass)
	}

	removeClass(cssClass: string): void {
		this.element.classList.remove(cssClass)
	}
}
