export type AddServerRequest = {
	gameId: number
	servers: {
		link: string
	}[]
}

export type ServerResult = {
	success: boolean
	server?: {
		id: string
		name: string
		link: string
	}
	error?: string
	input?: {
		link: string
	}
}

export type AddServerResponse = {
	success: boolean
	message: string
	results: ServerResult[]
	summary: {
		total: number
		successful: number
		failed: number
	}
	game: {
		id: string
		name: string
		gameid: number
	}
}