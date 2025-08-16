"use server"
import { unstable_cache } from "next/cache"
import payload from "../getPayload"

export const fetchGames = unstable_cache(
	async () => {
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
				createdAt: true,
				image: true,
				isActive: true,
				updatedAt: true,
			},
		})

		// Calculate actual server count for each game
		const gamesWithServerCount = await Promise.all(
			games.docs.map(async (game) => {
				const serverCount = await payload.count({
					collection: "servers",
					where: {
						game: {
							equals: game.id,
						},
					},
				})

				return {
					...game,
					serverCount: serverCount.totalDocs,
				}
			})
		)

		return {
			...games,
			docs: gamesWithServerCount,
		}
	},
	[],
	{ revalidate: 60 }
)
