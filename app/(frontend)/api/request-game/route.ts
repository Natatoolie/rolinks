import { NextRequest, NextResponse } from "next/server"
import payload from "@/utils/getPayload"
import { auth } from "@/utils/auth/auth"
import { RequestGameRequest, RequestGameResponse } from "./types"

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
		const body: RequestGameRequest = await request.json()
		const { gameId } = body

		if (!gameId || typeof gameId !== "number") {
			return NextResponse.json(
				{ error: "Valid gameId is required" },
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
						? "This game already exists and is active"
						: "This game already exists but is currently inactive",
					gameId,
					error: "Game already exists",
				},
				{ status: 409 }
			)
		}

		// Rate limiting - check recent game creations (last hour)
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

		// Check total games created by this user in the last hour
		const recentGames = await payload.find({
			collection: "games",
			where: {
				and: [
					{
						createdAt: {
							greater_than: oneHourAgo,
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

		// Limit to 5 game requests per hour globally (since we don't track requesters in Games collection)
		if (recentGames.totalDocs >= 10) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Rate limit exceeded. Too many game requests recently. Please try again later.",
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
					name: `Game ${gameId}`, // Temporary name, will be updated by hook
					gameid: gameId,
					robux: 0, // Default robux cost
					isActive: false, // Inactive until approved by admin
				},
				context: {
					triggerHook: false,
				},
			})

			const response: RequestGameResponse = {
				success: true,
				message:
					"Game added successfully! It will be reviewed by administrators before becoming active.",
				gameId,
			}

			return NextResponse.json(response)
		} catch (error) {
			console.error("Error creating game:", error)
			return NextResponse.json(
				{
					success: false,
					message: "Failed to add game",
					error: "Database error",
					gameId,
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		console.error("API Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
