"use client"

import { useState, useEffect, useMemo } from "react"
import {
	Search,
	Grid3X3,
	List,
	SortAsc,
	SortDesc,
	Gamepad2,
	Users,
	ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { fetchGames } from "@/utils/actions/fetchGames"
import { Game, Media } from "@/payload-types"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"
import { useQueryState } from "nuqs"
import { RobuxIcon } from "@/components/ui/robux-icon"

type ViewMode = "grid" | "list"
type SortOption = "name" | "serverCount" | "robux"
type SortDirection = "asc" | "desc"

export default function GamesPage() {
	const [games, setGames] = useState<Game[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useQueryState("q", { defaultValue: "" })
	const [viewMode, setViewMode] = useQueryState("view", {
		defaultValue: "grid" as ViewMode,
		parse: (value) => (value === "list" ? "list" : ("grid" as ViewMode)),
	})
	const [sortBy, setSortBy] = useQueryState("sort", {
		defaultValue: "name" as SortOption,
		parse: (value) =>
			["name", "serverCount", "robux"].includes(value)
				? (value as SortOption)
				: "name",
	})
	const [sortDirection, setSortDirection] = useQueryState("dir", {
		defaultValue: "asc" as SortDirection,
		parse: (value) => (value === "desc" ? "desc" : ("asc" as SortDirection)),
	})

	// Load games on mount
	useEffect(() => {
		const loadGames = async () => {
			try {
				setLoading(true)
				const response = await fetchGames()
				setGames(response.docs || [])
			} catch (error) {
				console.error("Error fetching games:", error)
			} finally {
				setLoading(false)
			}
		}

		loadGames()
	}, [])

	// Helper function to get image URL
	const getImageUrl = (image: string | Media | undefined): string | null => {
		if (!image) return null
		return typeof image === "string" ? image : image.url || null
	}

	// Filter and sort games
	const filteredAndSortedGames = useMemo(() => {
		const filtered = games.filter(
			(game) =>
				game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				game.gameid.toString().includes(searchQuery)
		)

		// Sort games
		filtered.sort((a, b) => {
			let aValue: string | number, bValue: string | number

			switch (sortBy) {
				case "name":
					aValue = a.name.toLowerCase()
					bValue = b.name.toLowerCase()
					break
				case "serverCount":
					aValue = a.serverCount || 0
					bValue = b.serverCount || 0
					break
				case "robux":
					aValue = a.robux || 0
					bValue = b.robux || 0
					break
				default:
					return 0
			}

			if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
			if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
			return 0
		})

		return filtered
	}, [games, searchQuery, sortBy, sortDirection])

	const toggleSort = (option: SortOption) => {
		if (sortBy === option) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc")
		} else {
			setSortBy(option)
			setSortDirection("asc")
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'>
				<Navbar />
				<div className='container mx-auto px-4 py-8'>
					<div className='mb-8'>
						<h1 className='text-4xl font-bold text-white mb-4'>Browse Games</h1>
						<div className='w-full max-w-md bg-gray-800 rounded-lg px-4 py-3 animate-pulse'>
							<div className='h-4 bg-gray-700 rounded w-32'></div>
						</div>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
						{Array.from({ length: 10 }).map((_, i) => (
							<div
								key={i}
								className='bg-gray-900/50 rounded-xl border border-gray-800 p-4 animate-pulse'
							>
								<div className='aspect-square bg-gray-800 rounded-lg mb-4'></div>
								<div className='h-4 bg-gray-800 rounded mb-2'></div>
								<div className='h-3 bg-gray-800 rounded w-20 mb-1'></div>
								<div className='h-3 bg-gray-800 rounded w-16'></div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'>
			<Navbar />
			{/* Background elements */}
			<div className='absolute inset-0 overflow-hidden'>
				<div
					className='absolute inset-0 opacity-[0.03]'
					style={{
						backgroundImage: `
							linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
						`,
						backgroundSize: "50px 50px",
					}}
				/>
				<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse' />
				<div
					className='absolute top-3/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse'
					style={{ animationDelay: "2s" }}
				/>
			</div>

			<div className='relative z-10 container mx-auto px-4 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight'>
						Browse Games
					</h1>
					<p className='text-gray-400 text-lg max-w-2xl'>
						Discover and explore {games.length} games with private servers
						available.
					</p>
				</div>

				{/* Search and Controls */}
				<div className='mb-8 space-y-4'>
					{/* Search Bar */}
					<div className='flex items-center bg-gray-800 rounded-lg px-4 py-3 max-w-md border border-gray-700 focus-within:border-gray-600 transition-colors'>
						<Search className='h-5 w-5 text-gray-400 mr-3 flex-shrink-0' />
						<input
							type='text'
							placeholder='Search games by name or ID...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='bg-transparent text-white placeholder-gray-400 outline-none flex-1'
						/>
					</div>

					{/* Controls Row */}
					<div className='flex flex-wrap items-center gap-3 lg:gap-4'>
						{/* View Mode Toggle */}
						<div className='flex items-center bg-gray-900/60 backdrop-blur-sm rounded-full p-1 border border-gray-700/50 shadow-lg'>
							<button
								onClick={() => setViewMode("grid")}
								className={cn(
									"flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200",
									viewMode === "grid"
										? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
										: "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
								)}
							>
								<Grid3X3 className='h-4 w-4' />
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={cn(
									"flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200",
									viewMode === "list"
										? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
										: "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
								)}
							>
								<List className='h-4 w-4' />
							</button>
						</div>

						{/* Sort Controls */}
						<div className='flex items-center bg-gray-900/40 backdrop-blur-sm rounded-full border border-gray-700/30 overflow-hidden'>
							<span className='text-xs text-gray-400 font-medium px-4 py-2 bg-gray-800/30'>
								Sort by
							</span>
							<div className='flex items-center'>
								<button
									onClick={() => toggleSort("name")}
									className={cn(
										"px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
										sortBy === "name"
											? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-l border-emerald-500/30"
											: "text-gray-300 hover:text-white hover:bg-gray-800/40 border-l border-gray-700/50"
									)}
								>
									Name
									{sortBy === "name" && (
										<div className='flex items-center'>
											{sortDirection === "asc" ? (
												<SortAsc className='h-3 w-3 text-emerald-400' />
											) : (
												<SortDesc className='h-3 w-3 text-emerald-400' />
											)}
										</div>
									)}
								</button>
								<button
									onClick={() => toggleSort("serverCount")}
									className={cn(
										"px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
										sortBy === "serverCount"
											? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-l border-purple-500/30"
											: "text-gray-300 hover:text-white hover:bg-gray-800/40 border-l border-gray-700/50"
									)}
								>
									Servers
									{sortBy === "serverCount" && (
										<div className='flex items-center'>
											{sortDirection === "asc" ? (
												<SortAsc className='h-3 w-3 text-purple-400' />
											) : (
												<SortDesc className='h-3 w-3 text-purple-400' />
											)}
										</div>
									)}
								</button>
								<button
									onClick={() => toggleSort("robux")}
									className={cn(
										"px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
										sortBy === "robux"
											? "bg-gradient-to-r from-gray-500/20 to-gray-400/20 text-white border-l border-gray-500/30"
											: "text-gray-300 hover:text-white hover:bg-gray-800/40 border-l border-gray-700/50"
									)}
								>
									Robux
									{sortBy === "robux" && (
										<div className='flex items-center'>
											{sortDirection === "asc" ? (
												<SortAsc className='h-3 w-3 text-white' />
											) : (
												<SortDesc className='h-3 w-3 text-white' />
											)}
										</div>
									)}
								</button>
							</div>
						</div>

						{/* Results Count */}
						<div className='ml-auto bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-full px-4 py-2'>
							<span className='text-sm font-medium text-gray-300'>
								{filteredAndSortedGames.length}
							</span>
							<span className='text-xs text-gray-500 ml-1'>
								of {games.length} games
							</span>
						</div>
					</div>
				</div>

				{/* Games Display */}
				{filteredAndSortedGames.length === 0 ? (
					<div className='text-center py-16'>
						<Gamepad2 className='h-16 w-16 text-gray-600 mx-auto mb-4' />
						<h3 className='text-xl font-medium text-gray-400 mb-2'>
							No games found
						</h3>
						<p className='text-gray-500'>
							{searchQuery
								? `No games match "${searchQuery}"`
								: "No games available"}
						</p>
					</div>
				) : viewMode === "grid" ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
						{filteredAndSortedGames.map((game) => (
							<div
								key={game.id}
								onClick={() => (window.location.href = `/game/${game.id}`)}
								className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group'
							>
								{/* Game Image */}
								<div className='relative aspect-square bg-gray-800'>
									{getImageUrl(game.image) ? (
										<Image
											src={getImageUrl(game.image)!}
											alt={game.name}
											fill
											className='object-cover'
										/>
									) : (
										<div className='w-full h-full flex items-center justify-center text-gray-500'>
											<Gamepad2 className='h-12 w-12' />
										</div>
									)}

									{/* Hover overlay */}
									<div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm'>
										<button
											onClick={(e) => {
												e.stopPropagation()
												window.location.href = `/game/${game.id}/servers`
											}}
											className='group/btn relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-[2px] rounded-full overflow-hidden transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60'
										>
											<div className='bg-gray-900 rounded-full p-4 group-hover/btn:bg-gray-800 transition-all duration-200'>
												<ExternalLink className='h-6 w-6 text-blue-300 group-hover/btn:text-blue-200 transition-colors duration-200' />
											</div>
										</button>
									</div>
								</div>

								{/* Game Info */}
								<div className='p-4'>
									<h3 className='text-white font-semibold text-sm mb-2 truncate group-hover:text-blue-400 transition-colors'>
										{game.name}
									</h3>

									<div className='space-y-1 text-xs'>
										<div className='flex items-center text-gray-400'>
											<Users className='h-3 w-3 mr-1 flex-shrink-0' />
											<span>
												{(game.serverCount || 0).toLocaleString()} servers
											</span>
										</div>
										<div className='flex items-center text-white'>
											<RobuxIcon className='mr-1 flex-shrink-0' size={18} />
											<span>{game.robux || 0} robux</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='space-y-3'>
						{filteredAndSortedGames.map((game) => (
							<div
								key={game.id}
								onClick={() => (window.location.href = `/game/${game.id}`)}
								className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-gray-700 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group'
							>
								<div className='flex items-center gap-4'>
									{/* Game Image */}
									<div className='w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0'>
										{getImageUrl(game.image) ? (
											<Image
												src={getImageUrl(game.image)!}
												alt={game.name}
												width={64}
												height={64}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center text-gray-500'>
												<Gamepad2 className='h-6 w-6' />
											</div>
										)}
									</div>

									{/* Game Info */}
									<div className='flex-1 min-w-0'>
										<h3 className='text-white font-semibold text-lg mb-1 truncate group-hover:text-blue-400 transition-colors'>
											{game.name}
										</h3>
										<div className='text-sm text-gray-500'>
											Game ID: {game.gameid}
										</div>
									</div>

									{/* Stats */}
									<div className='flex items-center gap-6 text-sm'>
										<div className='flex items-center text-gray-400'>
											<Users className='h-4 w-4 mr-2' />
											<span className='hidden xs:inline'>
												{(game.serverCount || 0).toLocaleString()} servers
											</span>
											<span className='xs:hidden'>
												{(game.serverCount || 0).toLocaleString()}
											</span>
										</div>
										<div className='hidden sm:flex items-center text-white'>
											<RobuxIcon className='mr-2' size={20} />
											<span>{game.robux || 0} robux</span>
										</div>
									</div>

									{/* Action Button */}
									<button
										onClick={(e) => {
											e.stopPropagation()
											window.location.href = `/game/${game.id}/servers`
										}}
										className='group/btn relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-[1.5px] rounded-full overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex-shrink-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
									>
										<div className='bg-gray-900 rounded-full p-2.5 group-hover/btn:bg-gray-800 transition-all duration-200'>
											<ExternalLink className='h-5 w-5 text-blue-300 group-hover/btn:text-blue-200 transition-colors duration-200' />
										</div>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
