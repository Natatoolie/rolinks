import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
	// Protect settings routes
	if (request.nextUrl.pathname.startsWith("/settings")) {
		// Check for authentication cookie or session
		const authCookie = request.cookies.get("better-auth.session_token")
		
		if (!authCookie) {
			// Redirect to home if not authenticated
			return NextResponse.redirect(new URL("/", request.url))
		}
	}

	// Add CSRF protection for destructive API endpoints
	if (
		request.method === "POST" ||
		request.method === "DELETE" ||
		request.method === "PUT"
	) {
		const pathname = request.nextUrl.pathname
		
		// Require CSRF token for sensitive operations
		if (
			pathname.includes("/api/settings/delete-account") ||
			pathname.includes("/api/settings/sessions")
		) {
			const csrfToken = request.headers.get("x-csrf-token")
			const origin = request.headers.get("origin")
			const host = request.headers.get("host")

			// Basic CSRF protection
			if (!origin || !host || !origin.includes(host)) {
				return NextResponse.json(
					{ error: "Invalid origin" },
					{ status: 403 }
				)
			}

			// For delete account, require additional CSRF token
			if (pathname.includes("/api/settings/delete-account") && !csrfToken) {
				return NextResponse.json(
					{ error: "CSRF token required" },
					{ status: 403 }
				)
			}
		}
	}

	// Add security headers
	const response = NextResponse.next()
	
	response.headers.set("X-Frame-Options", "DENY")
	response.headers.set("X-Content-Type-Options", "nosniff")
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
	response.headers.set(
		"Content-Security-Policy",
		"default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;"
	)

	return response
}

export const config = {
	matcher: [
		"/settings/:path*",
		"/api/settings/:path*",
	],
}