export const QUERY_MODAL_DEFAULT_OPTS: QueryModalOpts = {
	modalTitle: "Mediaverse Query",
	preselectedAPIs: [],
	prefilledQueryString: "",
};

export interface QueryModalOpts {
	modalTitle?: string;
	preselectedAPIs?: any[];
	prefilledQueryString?: string;
}

/* The data the query modal returns */
export interface QueryModalData {
	query: string;
	APIs: any[];
}

/* The option's specifications */
export interface QueryModalOptionSpecs {
	id: string;
	name: string;
	icon: string;
	color: string;
}
