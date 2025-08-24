/**
 * API Configuration
 * Centralized configuration for API endpoints to avoid magic numbers
 */

// Time intervals in milliseconds
export const TIME_INTERVALS = {
	FIVE_MINUTES: 5 * 60 * 1000,
	ONE_HOUR: 60 * 60 * 1000,
} as const

// Server-related configuration
export const SERVER_CONFIG = {
	// Maximum servers per single request
	MAX_SERVERS_PER_REQUEST: 10,
	// Maximum servers a user can create within the rate limit window
	MAX_SERVERS_PER_USER_WINDOW: 20,
	// Time window for server creation rate limiting
	RATE_LIMIT_WINDOW: TIME_INTERVALS.FIVE_MINUTES,
	// Retry after time for rate limiting (in seconds)
	RATE_LIMIT_RETRY_AFTER: 300, // 5 minutes
} as const

// Game-related configuration
export const GAME_CONFIG = {
	// Maximum inactive games that can be created within the rate limit window
	MAX_INACTIVE_GAMES_PER_WINDOW: 5,
	// Time window for game creation rate limiting
	RATE_LIMIT_WINDOW: TIME_INTERVALS.ONE_HOUR,
	// Default robux cost for new games
	DEFAULT_ROBUX_COST: 0,
} as const

// Error messages
export const ERROR_MESSAGES = {
	// Authentication errors
	UNAUTHORIZED: "Unauthorized",

	// Validation errors
	GAME_ID_AND_SERVERS_REQUIRED: "gameId and servers array are required",
	VALID_GAME_ID_REQUIRED: "Valid gameId is required",
	LINK_REQUIRED: "Link is required",

	// Rate limiting errors
	MAX_SERVERS_EXCEEDED: (max: number) =>
		`Maximum ${max} servers allowed per request`,
	SERVER_RATE_LIMIT_EXCEEDED: (max: number, window: string) =>
		`Rate limit exceeded. Maximum ${max} servers per ${window}.`,
	GAME_RATE_LIMIT_EXCEEDED:
		"Rate limit exceeded. Too many game requests recently. Please try again later.",

	// Game errors
	GAME_NOT_FOUND: "Game not found or not active",
	GAME_ALREADY_EXISTS_ACTIVE: "This game already exists and is active",
	GAME_ALREADY_EXISTS_INACTIVE:
		"This game already exists but is currently inactive",

	// Database errors
	FAILED_TO_CREATE_SERVER: "Failed to create server in database",
	FAILED_TO_ADD_GAME: "Failed to add game",

	// Generic errors
	INTERNAL_SERVER_ERROR: "Internal server error",
} as const

// Success messages
export const SUCCESS_MESSAGES = {
	GAME_ADDED:
		"Game added successfully! It will be reviewed by administrators before becoming active.",
	SERVERS_ADDED: (successful: number, failed: number) =>
		`${successful} server(s) added successfully, ${failed} failed`,
} as const

// Game defaults
export const GAME_DEFAULTS = {
	IS_ACTIVE: false,
	ROBUX_COST: GAME_CONFIG.DEFAULT_ROBUX_COST,
} as const

// Rate limiting window descriptions (for error messages)
export const RATE_LIMIT_DESCRIPTIONS = {
	FIVE_MINUTES: "5 minutes",
	ONE_HOUR: "hour",
} as const
