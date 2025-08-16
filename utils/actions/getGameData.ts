"use server"
import { unstable_cache } from "next/cache"
import payload from "../getPayload"

export const fetchServerListData = unstable_cache(
	async ({ gameId, page = 1 }: { gameId: number; page?: number }) => {
		const serverListData = await payload.find({
			collection: "servers",
			where: {
				and: [
					{
						"game.gameid": {
							equals: gameId,
						},
					},
					{
						"game.isActive": {
							equals: true,
						},
					},
				],
			},
			page: page,
			limit: 4,
			sort: ["-checkedAt"],
		})

		if (!serverListData.docs) return null

		return {
			servers: serverListData.docs,
			totalPages: serverListData.totalPages,
			currentPage: serverListData.page,
			totalDocs: serverListData.totalDocs,
			hasNextPage: serverListData.hasNextPage,
			hasPrevPage: serverListData.hasPrevPage,
		}
	},
	[],
	{ revalidate: 60 }
)

export const fetchGameData = unstable_cache(
	async (gameId: number) => {
		try {
			const gameData = await payload.find({
				collection: "games",
				where: {
					and: [
						{
							gameid: {
								equals: gameId,
							},
						},
						{
							isActive: {
								equals: true,
							},
						},
					],
				},
				limit: 1,
			})

			const game = gameData.docs[0]
			if (!game) return null
			return game
		} catch (error) {
			console.error("Error fetching game:", error)
			return null
		}
	},
	[],
	{ revalidate: 60 }
)
