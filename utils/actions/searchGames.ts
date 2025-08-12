"use server"
import payload from "../getPayload"
import { Game } from "@/payload-types"

export const searchGames = async (query: string): Promise<{ docs: Game[] }> => {
	if (!query.trim()) {
		return { docs: [] }
	}

	const games = await payload.find({
		collection: "games",
		where: {
			and: [
				{
					isActive: {
						equals: true,
					},
				},
				{
					or: [
						{
							name: {
								contains: query,
							},
						},
					],
				},
			],
		},
		limit: 8, // Limit results to prevent excessive data transfer
		sort: ["-serverCount"], // Sort by server count descending
	})

	return games
}

// https://games.roblox.com/v1/vip-servers/64058740230981320855386163956874
