import React from "react"
import "./globals.css"
import NuqsProvider from "@/components/providers/nuqs-provider"
import Navbar from "@/components/navbar"

export const metadata = {
	description: "A blank template using Payload in a Next.js app.",
	title: "Payload Blank Template",
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
