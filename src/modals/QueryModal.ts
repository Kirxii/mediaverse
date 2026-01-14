import { Modal, Notice, TextComponent } from "obsidian";
import Mediaverse from "../main";
import {
	QUERY_MODAL_DEFAULT_OPTS,
	QueryModalData,
	QueryModalOpts,
} from "../utils/ModalHelper";

interface QueryModalOptionSpecs {
	id: string;
	name: string;
	icon: string;
	color: string;
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
		}

		return wrapper;
	}

	onOpen(): Promise<void> | void {
		const { contentEl } = this;

		this.setTitle(this.title);

		const placeholder = "Query media by title";
		const queryComponent = new TextComponent(contentEl);

		queryComponent.setPlaceholder(placeholder);
		queryComponent.setValue(this.query);
		queryComponent.onChange((value) => (this.query = value));
		queryComponent.inputEl.style.width = "100%";
		queryComponent.inputEl.addEventListener(
			"keydown",
			this.keypressCallback.bind(this),
		);

		contentEl.appendChild(queryComponent.inputEl);
		queryComponent.inputEl.focus();

		const optionsWrapper = contentEl.createDiv({
			cls: "mediaverse-options-wrapper",
		});
		this.createAPIToggles(optionsWrapper, [
			{
				id: "mal",
				name: "MalAPI",
				icon: "https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ",
				color: "#ff0000",
			},
			{
				id: "anilist",
				name: "AniListAPI",
				icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/AniList_logo.svg/1200px-AniList_logo.svg.png",
				color: "#00ff00",
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
