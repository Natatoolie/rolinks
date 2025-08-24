import { NextRequest, NextResponse } from "next/server"
import payload from "@/utils/getPayload"
import { generateName } from "@/lib/serverNames"
import { auth } from "@/utils/auth/auth"
import { AddServerRequest, AddServerResponse, ServerResult } from "./types"
import {
	SERVER_CONFIG,
	ERROR_MESSAGES,
	SUCCESS_MESSAGES,
	RATE_LIMIT_DESCRIPTIONS,
} from "@/config/APIConfig"

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session) {
			return NextResponse.json(
				{ error: ERROR_MESSAGES.UNAUTHORIZED }, 
				{ status: 401 }
			)
		}

		const user = session.user
		const body: AddServerRequest = await request.json()
		const { gameId, servers } = body

		if (!gameId || !servers || !Array.isArray(servers)) {
			return NextResponse.json(
				{ error: ERROR_MESSAGES.GAME_ID_AND_SERVERS_REQUIRED },
				{ status: 400 }
			)
		}

		// Basic rate limiting - max servers per request
		if (servers.length > SERVER_CONFIG.MAX_SERVERS_PER_REQUEST) {
			return NextResponse.json(
				{ error: ERROR_MESSAGES.MAX_SERVERS_EXCEEDED(SERVER_CONFIG.MAX_SERVERS_PER_REQUEST) },
				{ status: 400 }
			)
		}

		// Rate limiting - check recent submissions
		const rateLimitWindowAgo = new Date(Date.now() - SERVER_CONFIG.RATE_LIMIT_WINDOW).toISOString()
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
							greater_than: rateLimitWindowAgo,
						},
					},
				],
			},
			user: user.id,
		})

		// Check if user exceeds server creation rate limit
		if (recentServers.totalDocs + servers.length > SERVER_CONFIG.MAX_SERVERS_PER_USER_WINDOW) {
			return NextResponse.json(
				{
					error: ERROR_MESSAGES.SERVER_RATE_LIMIT_EXCEEDED(
						SERVER_CONFIG.MAX_SERVERS_PER_USER_WINDOW,
						RATE_LIMIT_DESCRIPTIONS.FIVE_MINUTES
					),
					retryAfter: SERVER_CONFIG.RATE_LIMIT_RETRY_AFTER,
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
				{ error: ERROR_MESSAGES.GAME_NOT_FOUND },
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
					error: ERROR_MESSAGES.LINK_REQUIRED,
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
					error: ERROR_MESSAGES.FAILED_TO_CREATE_SERVER,
					input: serverData,
				})
			}
		}

		// Calculate success/failure counts
		const successCount = results.filter((r) => r.success).length
		const failureCount = results.filter((r) => !r.success).length

		const response: AddServerResponse = {
			success: true,
			message: SUCCESS_MESSAGES.SERVERS_ADDED(successCount, failureCount),
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
			{ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
			{ status: 500 }
		)
	}
}
