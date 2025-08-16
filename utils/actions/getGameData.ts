"use server"
import payload from "../getPayload"

export const fetchServerListData = async ({
	gameId,
	page = 1,
}: {
	gameId: string
	page?: number
}) => {
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
		limit: 10,
		sort: ["-checkedAt"],
	})
	const serverList = serverListData.docs
	if (!serverList) return null
	return serverList
}

export const fetchGameData = async (gameId: string) => {
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
}
