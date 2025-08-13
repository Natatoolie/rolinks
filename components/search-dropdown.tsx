"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Search, X, Clock, TrendingUp, Server, Trash2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { searchGames } from "@/utils/actions/searchGames"
import { fetchGames } from "@/utils/actions/fetchGames"
import { Game, Media } from "@/payload-types"

// Cache for search results to avoid excessive API calls
const searchCache = new Map<string, { results: Game[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Cache for trending games
let trendingGamesCache: Game[] | null = null
let trendingGamesCacheTimestamp = 0

const TRENDING_CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

interface SearchDropdownProps {
	placeholder?: string
	className?: string
	isMobile?: boolean
}

export default function SearchDropdown({
	placeholder = "Search servers...",
	className,
	isMobile = false,
}: SearchDropdownProps) {
	const [query, setQuery] = useState("")
	const [isOpen, setIsOpen] = useState(false)
	const [results, setResults] = useState<Game[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [recentSearches, setRecentSearches] = useState<
		Array<{ name: string; id?: string; image?: string }>
	>([])
	const [trendingGames, setTrendingGames] = useState<Game[]>([])

	const searchRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const resultsRef = useRef<HTMLDivElement>(null)

	// Load trending games on component mount
	useEffect(() => {
		const loadTrendingGames = async () => {
			const now = Date.now()

			// Check if we have cached trending games that are still valid
			if (
				trendingGamesCache &&
				now - trendingGamesCacheTimestamp < TRENDING_CACHE_DURATION
			) {
				setTrendingGames(trendingGamesCache.slice(0, 5))
				return
			}

			try {
				const response = await fetchGames()
				const games = response.docs || []

				// Sort by server count and take top 5
				const topGames = games
					.filter((game) => game.serverCount && game.serverCount > 0)
					.sort((a, b) => (b.serverCount || 0) - (a.serverCount || 0))
					.slice(0, 5)

				// Cache the results
				trendingGamesCache = topGames
				trendingGamesCacheTimestamp = now

				setTrendingGames(topGames)
			} catch (error) {
				console.error("Error loading trending games:", error)
			}
		}

		loadTrendingGames()
	}, [])

	// Debounced search function
	const debounceSearch = useCallback(
		(() => {
			let timeoutId: NodeJS.Timeout
			return (searchQuery: string) => {
				clearTimeout(timeoutId)
				timeoutId = setTimeout(() => {
					performSearch(searchQuery)
				}, 300)
			}
		})(),
		[]
	)

	const performSearch = async (searchQuery: string) => {
		if (!searchQuery.trim()) {
			setResults([])
			setIsLoading(false)
			return
		}

		const cacheKey = searchQuery.toLowerCase().trim()
		const now = Date.now()

		// Check cache first
		const cached = searchCache.get(cacheKey)
		if (cached && now - cached.timestamp < CACHE_DURATION) {
			setResults(cached.results)
			setIsLoading(false)
			setSelectedIndex(-1)
			return
		}

		setIsLoading(true)

		try {
			const response = await searchGames(searchQuery)
			const games = response.docs || []

			// Cache the results
			searchCache.set(cacheKey, {
				results: games,
				timestamp: now,
			})

			setResults(games)
			setSelectedIndex(-1)
		} catch (error) {
			console.error("Error searching games:", error)
			setResults([])
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setQuery(value)
		setIsOpen(true)

		if (value.trim()) {
			setIsLoading(true)
			debounceSearch(value)
		} else {
			setResults([])
			setIsLoading(false)
		}
	}

	const handleSearch = (
		searchTerm: string,
		gameId?: string,
		gameImage?: string
	) => {
		setQuery(searchTerm)
		setIsOpen(false)

		// Add to recent searches with game data
		const searchItem = { name: searchTerm, id: gameId, image: gameImage }
		const newRecentSearches = [
			searchItem,
			...recentSearches.filter((s) => s.name !== searchTerm),
		].slice(0, 5)
		setRecentSearches(newRecentSearches)

		// Store in localStorage for persistence
		if (typeof window !== "undefined") {
			localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
		}

		// Navigate to games page with search query
		const url = `/games?q=${encodeURIComponent(searchTerm)}`
		window.location.href = url
	}

	const removeFromRecent = (index: number) => {
		const newRecentSearches = recentSearches.filter((_, i) => i !== index)
		setRecentSearches(newRecentSearches)

		// Update localStorage
		if (typeof window !== "undefined") {
			localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
		}
	}

	// Load recent searches from localStorage on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("recentSearches")
			if (stored) {
				try {
					setRecentSearches(JSON.parse(stored))
				} catch (error) {
					console.error("Error parsing recent searches:", error)
				}
			}
		}
	}, [])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen) return

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault()
				setSelectedIndex((prev) =>
					prev < results.length - 1 ? prev + 1 : prev
				)
				break
			case "ArrowUp":
				e.preventDefault()
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
				break
			case "Enter":
				e.preventDefault()
				if (selectedIndex >= 0 && results[selectedIndex]) {
					handleSearch(
						results[selectedIndex].name,
						results[selectedIndex].id,
						results[selectedIndex].image as string
					)
				} else if (query.trim()) {
					handleSearch(query)
				}
				break
			case "Escape":
				setIsOpen(false)
				inputRef.current?.blur()
				break
		}
	}

	const clearSearch = () => {
		setQuery("")
		setResults([])
		setIsOpen(false)
		inputRef.current?.focus()
	}

	const handleFocus = () => {
		setIsOpen(true)
	}

	// Click outside to close
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const highlightMatch = (text: string, searchQuery: string) => {
		if (!searchQuery.trim()) return text

		const regex = new RegExp(`(${searchQuery})`, "gi")
		const parts = text.split(regex)

		return parts.map((part, i) =>
			regex.test(part) ? (
				<span key={i} className='bg-yellow-400/20 text-yellow-300 font-medium'>
					{part}
				</span>
			) : (
				part
			)
		)
	}

	const showSuggestions = !query.trim() && isOpen
	const showResults = query.trim() && (results.length > 0 || isLoading)
	const showNoResults = query.trim() && !isLoading && results.length === 0

	return (
		<div ref={searchRef} className={cn("relative", className)}>
			{/* Search Input */}
			<div className='relative flex items-center border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm rounded-lg px-3 py-2 focus-within:border-gray-200/20 transition-colors shadow-sm'>
				<Search className='h-4 w-4 text-gray-400 mr-2 flex-shrink-0' />
				<input
					ref={inputRef}
					type='text'
					placeholder={placeholder}
					value={query}
					onChange={handleInputChange}
					onFocus={handleFocus}
					onKeyDown={handleKeyDown}
					className='bg-transparent text-white placeholder-gray-400 outline-none flex-1 min-w-0'
				/>
				{query && (
					<button
						onClick={clearSearch}
						className='text-gray-400 hover:text-white ml-2 flex-shrink-0'
					>
						<X className='h-4 w-4' />
					</button>
				)}
			</div>

			{/* Dropdown */}
			{(showSuggestions || showResults || showNoResults) && (
				<div
					className={cn(
						"absolute top-full left-0 right-0 border border-gray-200/10 bg-gray-950/95 backdrop-blur-sm rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto",
						isMobile ? "w-full" : "min-w-80"
					)}
				>
					{showSuggestions && (
						<div className='space-y-6'>
							{/* Trending Games */}
							{trendingGames.length > 0 && (
								<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-4'>
									<h3 className='text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center'>
										<TrendingUp className='h-3 w-3 mr-1' />
										Trending Games
									</h3>
									<div className='space-y-2'>
										{trendingGames.map((game) => (
											<button
												key={game.id}
												onClick={() =>
													handleSearch(game.name, game.id, game.image as string)
												}
												className='w-full text-left p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors flex items-center gap-3'
											>
												<div className='w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-white/[0.02] border border-gray-200/10'>
													{game.image ? (
														<Image
															src={game.image}
															alt={game.name}
															width={32}
															height={32}
															className='w-full h-full object-cover'
														/>
													) : (
														<div className='w-full h-full flex items-center justify-center'>
															<Server className='h-4 w-4 text-gray-400' />
														</div>
													)}
												</div>
												<div className='flex-1 min-w-0'>
													<div className='truncate font-medium'>
														{game.name}
													</div>
													<div className='text-xs text-gray-400'>
														{game.serverCount?.toLocaleString()} servers
													</div>
												</div>
											</button>
										))}
									</div>
								</div>
							)}

							{/* Recent Searches */}
							{recentSearches.length > 0 && (
								<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-4'>
									<h3 className='text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center'>
										<Clock className='h-3 w-3 mr-1' />
										Recent
									</h3>
									<div className='space-y-2'>
										{recentSearches.map((item, index) => (
											<div
												key={`${item.name}-${index}`}
												className='group relative'
											>
												<button
													onClick={() =>
														handleSearch(item.name, item.id, item.image)
													}
													className='w-full text-left p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors flex items-center gap-3'
												>
													<div className='w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-white/[0.02] border border-gray-200/10'>
														{item.image ? (
															<Image
																src={item.image}
																alt={item.name}
																width={32}
																height={32}
																className='w-full h-full object-cover'
															/>
														) : (
															<div className='w-full h-full flex items-center justify-center'>
																<Clock className='h-4 w-4 text-gray-400' />
															</div>
														)}
													</div>
													<div className='flex-1 min-w-0'>
														<div className='truncate font-medium'>
															{item.name}
														</div>
														<div className='text-xs text-gray-400'>
															Recent search
														</div>
													</div>
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation()
														removeFromRecent(index)
													}}
													className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded'
													title='Remove from recent searches'
												>
													<X className='h-3 w-3' />
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{isLoading && (
						<div className='p-4 text-center'>
							<div className='inline-flex items-center text-gray-400'>
								<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2'></div>
								Searching...
							</div>
						</div>
					)}

					{showResults && !isLoading && (
						<div className='p-3'>
							{results.map((game, index) => (
								<button
									key={game.id}
									onClick={() =>
										handleSearch(game.name, game.id, game.image as string)
									}
									className={cn(
										"w-full text-left p-2 rounded-lg transition-colors flex items-center gap-3",
										selectedIndex === index
											? "bg-blue-600/20 border border-blue-500/30"
											: "hover:bg-white/5"
									)}
								>
									<div className='w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-white/[0.02] border border-gray-200/10'>
										{game.image ? (
											<Image
												src={game.image}
												alt={game.name}
												width={32}
												height={32}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center'>
												<Server className='h-4 w-4 text-gray-400' />
											</div>
										)}
									</div>
									<div className='flex-1 min-w-0'>
										<div className='text-white font-medium truncate'>
											{highlightMatch(game.name, query)}
										</div>
										<div className='text-xs text-gray-400'>
											{game.serverCount?.toLocaleString() || 0} servers
										</div>
									</div>
								</button>
							))}
						</div>
					)}

					{showNoResults && (
						<div className='p-4 text-center text-gray-400'>
							<Server className='h-8 w-8 mx-auto mb-2 opacity-50' />
							<div className='text-sm'>
								No servers found for &quot;{query}&quot;
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
