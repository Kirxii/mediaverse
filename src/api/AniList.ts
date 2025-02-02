import multiline from "multiline-ts"

function log(value, tab = 4) {
  console.log(JSON.stringify(value, undefined, tab));
}

export type mediaSource = 
	| "ORIGINAL"
	| "MANGA"
	| "LIGHT_NOVEL"
	| "ANIME"
	| "VISUAL_NOVEL"
	| "VIDEO_GAME"
	| "OTHER"
	| "NOVEL"
	| "DOUJINSHI"
	| "WEB_NOVEL"
	| "LIVE_ACTION"
	| "GAME"
	| "COMIC"
	| "MULTIMEDIA_PROJECT"
	| "PICTURE_BOOK"

export class AniListAPI {
	constructor() {
		this.apiName = "AniListAPI"
		this.apiDescription = "A free API for anime, manga, and novels"
		this.apiUrl = "https://graphql.anilist.co"
	}

	async searchByTitle(title: string) {
		console.log(`Mediaverse: Searching for "${title}" with ${this.apiName}`)
		
		const query = multiline`
			query ($search: String!) {
				Page(page: 1, perPage: 16) {
					media(search: $search, type: ANIME, sort: [FORMAT, START_DATE]) {
						id
						format
						coverImage {
							extraLarge
						}
						title {
							romaji
							english
							native
						}
						# relations {
						#	edges {
						#		relationType
						#		node {
						#			id
						#			title {
						#				romaji
						#			}
						#			type
						#		}
						#	}
						#}
					}
				}
			}
		`
		const variables = {
			search: title
		}

		const options = {
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

		const fetchData = await fetch(this.apiUrl, options)
		if (!fetchData.ok) {
			throw new Error("Mediaverse: Fetch data failed, aborting")
		}
		const data = await fetchData.json()

		/* log(data.data.Page.media) */
		return data.data.Page.media
	}

	async findByID(id: number) {
		const variables = {
			id: id
		}
	}
}
