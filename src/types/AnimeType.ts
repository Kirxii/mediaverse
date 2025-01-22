export class AnimeType {
	romajiTitle: string
	englishTitle: string
	nativeTitle: string
	latestEpisode: number
	totalEpisodes: number

	relations: {
		type: string
		id: number
		title: {
			romajiTitle: string
			englishTitle: string
			nativeTitle: string
		}
	}[]

	userData: {
		onEpisode: number
	}
}
