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

export const getImageURLFromPlaceID = async (placeID: string) => {
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

	return imageUrl
}
