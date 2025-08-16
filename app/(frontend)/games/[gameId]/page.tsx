import React from "react"

import { fetchGameData, fetchServerListData } from "@/utils/actions/getGameData"

import GamesClientPage from "./client-page"

type GamePageProps = {
	params: Promise<{ gameId: string }>
}

export default async function GamePage({ params }: GamePageProps) {
	const [gameData, serverList] = await Promise.all([
		fetchGameData((await params).gameId),
		fetchServerListData({ gameId: (await params).gameId }),
	])

	const game = await fetchGameData((await params).gameId)
	if (!game) {
		return <>This page does not exist</>
	}

	return <GamesClientPage game={game} />
}
