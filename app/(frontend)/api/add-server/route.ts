import { NextRequest, NextResponse } from "next/server"
import payload from "@/utils/getPayload"
import { generateName } from "@/lib/serverNames"
import { auth } from "@/utils/auth/auth"
import { AddServerRequest, AddServerResponse, ServerResult } from "./types"

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const user = session.user
		const body: AddServerRequest = await request.json()
		const { gameId, servers } = body

		if (!gameId || !servers || !Array.isArray(servers)) {
			return NextResponse.json(
				{ error: "gameId and servers array are required" },
				{ status: 400 }
			)
		}

		// Basic rate limiting - max 10 servers per request
		if (servers.length > 10) {
			return NextResponse.json(
				{ error: "Maximum 10 servers allowed per request" },
				{ status: 400 }
			)
		}

		// Rate limiting - check recent submissions (last 5 minutes)
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
		const recentServers = await payload.find({
			collection: "servers",
			where: {
				and: [
					{
						creator: {
							equals: user.id,
						},
					},
					{
						createdAt: {
							greater_than: fiveMinutesAgo,
						},
					},
				],
			},
			user: user.id,
		})

		// Limit to 20 servers per 5 minutes per user
		if (recentServers.totalDocs + servers.length > 20) {
			return NextResponse.json(
				{
					error: "Rate limit exceeded. Maximum 20 servers per 5 minutes.",
					retryAfter: 300, // 5 minutes in seconds
				},
				{ status: 429 }
			)
		}

		// Validate that the game exists and is active
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

		if (!gameData.docs || gameData.docs.length === 0) {
			return NextResponse.json(
				{ error: "Game not found or not active" },
				{ status: 404 }
			)
		}

		const game = gameData.docs[0]
		const results: ServerResult[] = []

		// Process each server
		for (const serverData of servers) {
			const { link } = serverData
			const name = generateName()

			if (!link) {
				results.push({
					success: false,
					error: "Link is required",
					input: serverData,
				})
				continue
			}

			try {
				// Create the server
				const createdServer = await payload.create({
					collection: "servers",
					data: {
						name,
						link,
						game: game.id,
						creator: user.id,
						checkedAt: new Date().toISOString(),
					},
				})

				results.push({
					success: true,
					server: {
						id: createdServer.id,
						name: createdServer.name,
						link: createdServer.link,
					},
				})
			} catch (error) {
				console.error("Error creating server:", error)
				results.push({
					success: false,
					error: "Failed to create server in database",
					input: serverData,
				})
			}
		}

		// Calculate success/failure counts
		const successCount = results.filter((r) => r.success).length
		const failureCount = results.filter((r) => !r.success).length

		const response: AddServerResponse = {
			success: true,
			message: `${successCount} server(s) added successfully, ${failureCount} failed`,
			results,
			summary: {
				total: results.length,
				successful: successCount,
				failed: failureCount,
			},
			game: {
				id: game.id,
				name: game.name,
				gameid: game.gameid,
			},
		}

		return NextResponse.json(response)
	} catch (error) {
		console.error("API Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
