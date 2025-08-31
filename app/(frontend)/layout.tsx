import React from "react"
import "./globals.css"
import NuqsProvider from "@/components/providers/nuqs-provider"
import Navbar from "@/components/navbar"

export const metadata = {
	description: "Rolinks, a universal roblox private server sharing platform",
	title: "Rolinks",
}

export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props

	return (
		<html lang='en'>
			<body>
				<NuqsProvider>
					<Navbar />
					<main className=''>{children}</main>
				</NuqsProvider>
			</body>
		</html>
	)
}
