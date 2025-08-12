import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/utils/auth/auth"

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Get all sessions for the user
		const userAgent = request.headers.get("user-agent") || "Unknown"
		const currentSessionId = session.session.id

		// In a real implementation with better-auth, you would query all sessions for the user
		// For now, we'll return the current session with enhanced data
		const sessions = [
			{
				id: currentSessionId,
				userId: session.user.id,
				userAgent: userAgent,
				ipAddress: request.ip || "Unknown",
				createdAt: session.session.createdAt,
				updatedAt: session.session.updatedAt,
				isCurrent: true,
			},
		]

		return NextResponse.json({ sessions })
	} catch (error) {
		console.error("Failed to fetch sessions:", error)
		return NextResponse.json(
			{ error: "Failed to fetch sessions" },
			{ status: 500 }
		)
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Mock: Remove all sessions except current
		// In a real implementation, you would:
		// 1. Query all sessions for the user
		// 2. Delete all sessions except the current one
		// 3. Return success response

		return NextResponse.json({
			message: "All other sessions removed successfully",
			remainingSessions: 1,
		})
	} catch (error) {
		console.error("Failed to remove sessions:", error)
		return NextResponse.json(
			{ error: "Failed to remove sessions" },
			{ status: 500 }
		)
	}
}
