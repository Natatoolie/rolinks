import React from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/utils/auth/auth"
import { fetchGameData } from "@/utils/actions/getGameData"
import AddServerClient from "./client-page"

type AddServerPageProps = {
	params: Promise<{ gameId: string }>
}

export default async function AddServerPage({ params }: AddServerPageProps) {
	// Check authentication
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	const gameId = (await params).gameId
	const gameIdNumber = parseInt(gameId, 10)

	if (!session) {
		redirect(`/games/${gameId}`)
	}

	if (isNaN(gameIdNumber)) {
		redirect("/games")
	}

	const game = await fetchGameData(gameIdNumber)

	if (!game) {
		redirect("/games")
	}

	return <AddServerClient game={game} />
}
