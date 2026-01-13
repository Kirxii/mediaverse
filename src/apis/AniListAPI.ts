import multiline from "multiline-ts";
import { Media } from "utils/apis/AniListAPISuggestions";

export const DEFAULT_QUERY: string = multiline`
	query ($search: String!) {
		Page {
			media(search: $search, type: ANIME, sort: [FORMAT, START_DATE]) {
				coverImage {
					extraLarge
				}
				description
				endDate
				episodes
				format
				genres
				id
				nextAiringEpisode {
					episode
				}
				season
				seasonYear
				source
				startDate
				status
				relations {
					edges {
						node {
							id
							title {
								english
								native
								romaji
							}
							type
						}
						relationType(version: 2)
					}
				}
				title {
					english
					native
					romaji
				}
			}
		}
	}
`;

export class AniListAPI {
	apiName: string;
	apiDescription: string;
	apiUrl: string;

	constructor() {
		this.apiName = "AniListAPI";
		this.apiDescription = "A free API for anime, manga, and novels";
		this.apiUrl = "https://graphql.anilist.co";
	}

	async searchByTitle(title: string) {
		console.log(
			`Mediaverse: Searching for "${title}" with ${this.apiName}`,
		);

		const variables = {
			search: title,
		};

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query: DEFAULT_QUERY,
				variables: variables,
			}),
		};

		const fetchData = await fetch(this.apiUrl, options);
		if (!fetchData.ok) {
			throw new Error("Mediaverse: Fetch data failed, aborting");
		}
		const data: Media = (await fetchData.json()).data.Page.media;

		return data;
	}
}
