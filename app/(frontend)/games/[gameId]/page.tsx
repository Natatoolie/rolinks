import React from "react"

import { fetchGameData, fetchServerListData } from "@/utils/actions/getGameData"

import GamesClientPage from "./client-page"
import { redirect } from "next/navigation"

type GamePageProps = {
	params: Promise<{ gameId: number }>
}

export default async function GamePage({ params }: GamePageProps) {
	const gameId = (await params).gameId

	const [game, initialServerData] = await Promise.all([
		fetchGameData(gameId),
		fetchServerListData({ gameId, page: 1 }),
	])

	if (!game || !initialServerData) {
		redirect("/games")
	}

	return <GamesClientPage game={game} initialServerData={initialServerData} />
}
