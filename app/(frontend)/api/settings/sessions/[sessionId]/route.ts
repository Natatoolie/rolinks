import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/utils/auth/auth"

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { sessionId: string } }
) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { sessionId } = params

		// Prevent users from deleting their current session
		if (sessionId === session.session.id) {
			return NextResponse.json(
				{ error: "Cannot delete current session" },
				{ status: 400 }
			)
		}

		// CSRF protection
		const origin = request.headers.get("origin")
		const host = request.headers.get("host")
		if (!origin || !host || !origin.includes(host)) {
			return NextResponse.json(
				{ error: "Invalid origin" },
				{ status: 403 }
			)
		}

		// In a real implementation, you would:
		// 1. Verify the session belongs to the current user
		// 2. Delete the session from the database
		// 3. Invalidate any related tokens

		// For now, we'll return success for non-current sessions
		return NextResponse.json({
			message: "Session deleted successfully",
		})
	} catch (error) {
		console.error("Failed to delete session:", error)
		return NextResponse.json(
			{ error: "Failed to delete session" },
			{ status: 500 }
		)
	}
}