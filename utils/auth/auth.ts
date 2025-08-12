import { betterAuth as betterAuthBase, BetterAuthOptions } from "better-auth"
import { payloadAdapter } from "@payload-auth/better-auth-db-adapter"
import { BasePayload } from "payload"
import payload from "../getPayload"

export const betterAuthOptions: BetterAuthOptions = {
	database: payloadAdapter(payload, { enableDebugLogs: true }),
	plugins: [],

	emailAndPassword: {
		enabled: false,
		disableSignUp: true,
	},

	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
		},
	},

	user: {
		modelName: "users",
	},

	session: {
		modelName: "sessions",
	},

	verification: {
		modelName: "verifications",
	},

	account: {
		modelName: "account",
	},

	//... other options
}

export function betterAuth() {
	return betterAuthBase(betterAuthOptions)
}

export const auth = betterAuth()
