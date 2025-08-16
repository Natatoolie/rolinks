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
		select: {
			name: true,
			gameid: true,
			robux: true,
			serverCount: true,
			createdAt: true,
			image: true,
			isActive: true,
			updatedAt: true,
		},
	})
	return games
}
