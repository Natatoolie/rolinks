import { NumberMap } from "framer-motion"

type UniverseResponseType = {
	universeId: number | null
}

type ImageResponseType = {
	data: [
		{
			targetId: number
			state: string
			imageUrl: string
			version: string
		},
	]
}

export type PlaceDataResponse = {
	data: Array<{
		id: number
		rootPlaceId: number
		name: string
		description: string
		sourceName: null
		sourceDescription: null
		creator: {
			id: number
			name: string
			type: "User"
			isRNVAccount: boolean
			hasVerifiedBadge: boolean
		}
		price: null
		allowedGearGenres: Array<string>
		allowedGearCategories: Array<string>
		isGenreEnforced: boolean
		copyingAllowed: boolean
		playing: number
		visits: number
		maxPlayers: number
		created: string
		updated: string
		studioAccessToApisAllowed: boolean
		createVipServersAllowed: boolean
		universeAvatarType: "MorphToR15"
		genre: string
		genre_l1: string
		genre_l2: string
		isAllGenre: boolean
		isFavoritedByUser: boolean
		favoritedCount: number
	}>
}
export const getPlaceDataFromPlaceID = async (placeID: string) => {
	// Get univserse ID from placeID
	const data: UniverseResponseType = await fetch(
		`https://apis.roblox.com/universes/v1/places/${placeID}/universe`
	)
		.then((res) => res.json())
		.catch((err) => console.error(err))

	const universeID = data.universeId
	if (universeID === null) {
		return null
	}

	// Get name from universe ID
	const placeData: PlaceDataResponse = await fetch(
		`https://games.roblox.com/v1/games?universeIds=${universeID}`
	)
		.then((res) => res.json())
		.catch((err) => console.error(err))

	if (placeData.data === undefined) {
		return null
	}

	const name = placeData.data[0].name

	// Get image URL from universe ID
	const imageSize = 512
	const imagesData: ImageResponseType = await fetch(
		`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeID}&size=${imageSize}x${imageSize}&format=Png`
	)
		.then((res) => res.json())
		.catch((err) => console.error(err))

	if (imagesData.data === undefined) {
		return null
	}
	const imageData = imagesData.data[0]
	const imageUrl = imageData.imageUrl

	return { imageUrl, name }
}
