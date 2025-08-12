"use server"
import payload from "../getPayload"

export const fetchGame = async (gameId: string) => {
	try {
		const game = await payload.find({
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
		})
		return game.docs[0]
	} catch (error) {
		console.error("Error fetching game:", error)
		return null
	}
}
