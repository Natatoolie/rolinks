import React from "react"

import { fetchGameData, fetchServerListData } from "@/utils/actions/getGameData"

import GamesClientPage from "./client-page"

type GamePageProps = {
	params: Promise<{ gameId: string }>
}

export default async function GamePage({ params }: GamePageProps) {
	const gameId = (await params).gameId
	
	const [game, initialServerData] = await Promise.all([
		fetchGameData(gameId),
		fetchServerListData({ gameId, page: 1 }),
	])

	if (!game) {
		return <>This page does not exist</>
	}

	return <GamesClientPage game={game} initialServerData={initialServerData} />
}
