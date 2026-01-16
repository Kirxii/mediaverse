import { Modal, Notice, setIcon, TextComponent } from "obsidian";
import Mediaverse from "../main";
import {
	QUERY_MODAL_DEFAULT_OPTS,
	QueryModalData,
	QueryModalOpts,
} from "../utils/ModalHelper";

interface QueryModalOptionSpecs {
	id: string;
	name: string;
	icon?: string;
	color?: string;
}

export class MediaverseQueryModal extends Modal {
	plugin: Mediaverse;

	title: string;
	query: string;
	selectedAPIs: any[];
	isBusy: boolean;

	submitCallback?: (result: QueryModalData) => void;
	closeCallback?: (err?: Error) => void;

	private controller: AbortController;
	private signal: AbortController["signal"];

	constructor(plugin: Mediaverse, queryModalOpts: QueryModalOpts) {
		queryModalOpts = Object.assign(
			{},
			QUERY_MODAL_DEFAULT_OPTS,
			queryModalOpts,
		);
		super(plugin.app);

		this.plugin = plugin;
		this.title = queryModalOpts.modalTitle ?? "";
		this.selectedAPIs = [...(queryModalOpts.preselectedAPIs ?? [])];
		this.query = queryModalOpts.prefilledQueryString ?? "";
		this.isBusy = false;

		this.controller = new AbortController();
		this.signal = this.controller.signal;
	}

	private keypressCallback(event: KeyboardEvent): void {
		if (event.key === "Enter") {
			void this.search();
		}
	}

	async search(): Promise<void> {
		const QUERY_TOO_SHORT = `Query too short (${this.query.length} chars < 3 chars minimum)`;
		const NO_API = `No API selected (1 API minimum)`;

		if (!this.query || this.query.length < 3) {
			new Notice(QUERY_TOO_SHORT);
			return;
		}

		const APIs: any[] = this.selectedAPIs;

		if (APIs.length === 0) {
			new Notice(NO_API);
			return;
		}

		if (!this.isBusy) {
			this.isBusy = true;
		}
	}

	private createAPIToggles(
		parent: HTMLElement,
		options: QueryModalOptionSpecs[],
	): HTMLDivElement {
		const wrapper: HTMLDivElement = parent.createDiv({
			cls: "mediaverse-api-toggles-wrapper",
		});

		for (const option of options) {
			const optionEl: HTMLElement = wrapper.createDiv({
				cls: "mediaverse-api-toggle-option",
				attr: { id: option.id },
			});

			if (
				this.selectedAPIs.some((selectedAPI) => {
					selectedAPI.id === option.id;
				})
			) {
				optionEl.setAttribute("selected", "");
			}

<<<<<<< HEAD
			if (option.color) {
				optionEl.style.setProperty(
					"--mediaverse-selected-color",
					option.color,
				);
			}
			optionEl.createEl("img", { attr: { src: option.icon || "" } });
			optionEl.createEl("p", { text: option.name });

			optionEl.addEventListener(
				"click",
				(event) => {
					const target = event.currentTarget as HTMLElement;
					if (target.getAttribute("selected") !== null) {
						const attr = target.getAttributeNode(
							"selected",
						) as Attr;
						target.removeAttributeNode(attr);
						this.selectedAPIs = this.selectedAPIs.filter(
							(selectedAPI) =>
								selectedAPI !== target.getAttribute("id"),
						);
					} else {
						target.setAttribute("selected", "");
						this.selectedAPIs.push(target.getAttribute("id"));
					}
				},
				{ signal: this.signal },
			);
=======
			optionEl.style.setProperty(
				"--mediaverse-selected-color",
				option.color,
			);
			optionEl.createEl("img", { attr: { src: option.icon } });
			optionEl.createEl("p", { text: option.name });

			optionEl.addEventListener(
				"click",
				(event) => {
					const target = event.currentTarget as HTMLElement;
					if (target.getAttribute("selected")) {
						target.removeAttribute("selected");
						this.selectedAPIs = this.selectedAPIs.filter(
							(selectedAPI) => {
								selectedAPI !== target.getAttribute("id");
							},
						);
					} else {
						target.setAttribute("selected", "");
						this.selectedAPIs.push(target.getAttribute("id"));
					}
				},
				{ signal: this.signal },
			);
>>>>>>> 4016d6b1e397caf318cbb37a7af151aa10f2cdf4
		}

		return wrapper;
	}

	onOpen(): Promise<void> | void {
		const { contentEl } = this;

		this.setTitle(this.title);

		const queryComponentWrapper: HTMLElement = contentEl.createDiv({
			cls: "mediaverse-query-component-wrapper",
		});
		setIcon(queryComponentWrapper, "search");

		const queryComponent = new TextComponent(queryComponentWrapper);
		queryComponent.setPlaceholder("Query media by title");
		queryComponent.setValue(this.query);
		queryComponent.onChange((value) => (this.query = value));
		queryComponent.inputEl.setAttribute("id", "mediaverse-query-input");
		queryComponent.inputEl.addEventListener(
			"keydown",
			this.keypressCallback.bind(this),
			{ signal: this.signal },
		);

		queryComponentWrapper.appendChild(queryComponent.inputEl);
		queryComponent.inputEl.focus();

		const optionsWrapper = contentEl.createDiv({
			cls: "mediaverse-options-wrapper",
		});
		this.createAPIToggles(optionsWrapper, [
			{
				id: "mal",
				name: "MalAPI",
				icon: "https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ",
			},
			{
				id: "anilist",
				name: "AniListAPI",
				icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/AniList_logo.svg/1200px-AniList_logo.svg.png",
			},
		]);
	}

	onClose(): void {
		this.closeCallback?.();
		const { contentEl, controller } = this;
		controller.abort();
		contentEl.empty();
	}
}
