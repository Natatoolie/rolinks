#!/usr/bin/env node
import { generateSchema } from "@payload-auth/better-auth-db-adapter"
import { betterAuthOptions } from "../utils/auth/auth.js"

// Generate schema for better-auth collections
console.log("Generating better-auth collections...")

try {
	const collections = generateSchema(betterAuthOptions, {
		outputDir: "./collections/generated",
	})

	console.log("✅ Schema generation completed successfully!")
	console.log("📂 Files written to: ./collections/generated/")
	console.log(
		"⚠️  Remember to review and modify the generated collections before using them in production."
	)
} catch (error) {
	console.error("❌ Error generating schema:", error)
	process.exit(1)
}
