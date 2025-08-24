import { NextRequest, NextResponse } from "next/server"
import payload from "@/utils/getPayload"
import { auth } from "@/utils/auth/auth"
import { RequestGameRequest, RequestGameResponse } from "./types"
import {
	GAME_CONFIG,
	GAME_DEFAULTS,
	ERROR_MESSAGES,
	SUCCESS_MESSAGES,
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
		const body: RequestGameRequest = await request.json()
		const { gameId } = body

		if (!gameId || typeof gameId !== "number") {
			return NextResponse.json(
				{ error: ERROR_MESSAGES.VALID_GAME_ID_REQUIRED },
				{ status: 400 }
			)
		}

		// Check if game already exists
		const existingGame = await payload.find({
			collection: "games",
			where: {
				gameid: {
					equals: gameId,
				},
			},
			limit: 1,
		})

		if (existingGame.docs && existingGame.docs.length > 0) {
			const game = existingGame.docs[0]
			return NextResponse.json(
				{
					success: false,
					message: game.isActive
						? ERROR_MESSAGES.GAME_ALREADY_EXISTS_ACTIVE
						: ERROR_MESSAGES.GAME_ALREADY_EXISTS_INACTIVE,
					gameId,
					error: "Game already exists",
				},
				{ status: 409 }
			)
		}

		// Rate limiting - check recent game creations
		const rateLimitWindowAgo = new Date(
			Date.now() - GAME_CONFIG.RATE_LIMIT_WINDOW
		).toISOString()

		// Check total games created recently
		const recentGames = await payload.find({
			collection: "games",
			where: {
				and: [
					{
						createdAt: {
							greater_than: rateLimitWindowAgo,
						},
					},
					{
						isActive: {
							equals: false,
						},
					},
				],
			},
		})

		// Check if global game creation rate limit exceeded
		if (recentGames.totalDocs >= GAME_CONFIG.MAX_INACTIVE_GAMES_PER_WINDOW) {
			return NextResponse.json(
				{
					success: false,
					message: ERROR_MESSAGES.GAME_RATE_LIMIT_EXCEEDED,
					error: "Rate limit exceeded",
					gameId,
				},
				{ status: 429 }
			)
		}

		// Create the game with isActive: false
		try {
			const createdGame = await payload.create({
				collection: "games",
				data: {
					name: undefined, // Temporary name, will be updated by hook
					gameid: gameId,
					robux: GAME_DEFAULTS.ROBUX_COST,
					isActive: GAME_DEFAULTS.IS_ACTIVE, // Inactive until approved by admin
				},
				// context: {
				// 	// triggerHook: false,
				// },
			})

			const response: RequestGameResponse = {
				success: true,
				message: SUCCESS_MESSAGES.GAME_ADDED,
				gameId,
			}

			return NextResponse.json(response)
		} catch (error) {
			console.error("Error creating game:", error)
			return NextResponse.json(
				{
					success: false,
					message: ERROR_MESSAGES.FAILED_TO_ADD_GAME,
					error: "Database error",
					gameId,
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		console.error("API Error:", error)
		return NextResponse.json(
			{ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
			{ status: 500 }
		)
	}
}
