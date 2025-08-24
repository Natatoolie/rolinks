export interface RequestGameRequest {
	gameId: number
}

export interface RequestGameResponse {
	success: boolean
	message: string
	gameId?: number
	error?: string
}