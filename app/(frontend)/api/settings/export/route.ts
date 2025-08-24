import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/utils/auth/auth"

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const user = session.user

		// Compile user data for export
		const exportData = {
			profile: {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			account: {
				emailVerified: user.emailVerified,
				// Add other account-specific data
			},
			sessions: [
				// Mock session data - replace with actual queries
				{
					id: session.session.id,
					createdAt: session.session.createdAt,
					updatedAt: session.session.updatedAt,
					userAgent: request.headers.get("user-agent"),
					ipAddress: request.headers.get("x-forwarded-for") || 
						request.headers.get("x-real-ip") || 
						"unknown",
				},
			],
			preferences: {
				// Add user preferences if any
			},
			activityLog: {
				// Add activity log if tracked
				lastLogin: user.updatedAt,
				accountCreated: user.createdAt,
			},
			exportDate: new Date().toISOString(),
		}

		// Set headers for file download
		const headers = new Headers()
		headers.set("Content-Type", "application/json")
		headers.set(
			"Content-Disposition",
			`attachment; filename="rolinks-data-export-${new Date().toISOString().split("T")[0]}.json"`
		)

		return new NextResponse(JSON.stringify(exportData, null, 2), {
			status: 200,
			headers,
		})
	} catch (error) {
		console.error("Failed to export data:", error)
		return NextResponse.json(
			{ error: "Failed to export data" },
			{ status: 500 }
		)
	}
}