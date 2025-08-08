"use server"
import payload from "../getPayload"

export const fetchGames = async () => {
	const games = await payload.find({
		collection: "games",
		where: {
			isActive: {
				equals: true,
			},
		},
	})
	return games
}
