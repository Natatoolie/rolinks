"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
	Clock,
	Server,
	ArrowLeft,
	ExternalLink,
	Copy,
	RefreshCw,
	Search,
	Filter,
	Users,
	Check,
} from "lucide-react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RobuxIcon } from "@/components/ui/robux-icon"
import { fetchGame } from "@/utils/actions/fetchGame"
import { Game, Media } from "@/payload-types"

type GamePageProps = {
	params: Promise<{ gameId: string }>
}

type PrivateServer = {
	id: string
	name: string
	link: string
	lastChecked?: string
}

// Mock private server data - replace with actual backend integration
const mockPrivateServers: PrivateServer[] = [
	{
		id: "1",
		name: "Server Alpha",
		link: "https://www.roblox.com/games/292439477?privateServerLinkCode=abc123",
		lastChecked: "2024-01-15T10:25:00Z",
	},
	{
		id: "2",
		name: "Server Beta",
		link: "https://www.roblox.com/games/292439477?privateServerLinkCode=def456",
		lastChecked: "2024-01-15T10:24:00Z",
	},
	{
		id: "3",
		name: "Server Gamma",
		link: "https://www.roblox.com/games/292439477?privateServerLinkCode=ghi789",
		lastChecked: "2024-01-15T10:23:00Z",
	},
]

function formatTimeAgo(date: string) {
	const now = new Date()
	const past = new Date(date)
	const diffMs = now.getTime() - past.getTime()
	const diffMins = Math.floor(diffMs / 60000)

	if (diffMins < 1) return "Just now"
	if (diffMins < 60) return `${diffMins}m ago`
	const diffHours = Math.floor(diffMins / 60)
	if (diffHours < 24) return `${diffHours}h ago`
	const diffDays = Math.floor(diffHours / 24)
	return `${diffDays}d ago`
}

async function copyToClipboard(text: string) {
	try {
		await navigator.clipboard.writeText(text)
	} catch (err) {
		console.error("Failed to copy: ", err)
	}
}

export default function GamePage({ params }: GamePageProps) {
	const { gameId } = React.use(params)
	const [game, setGame] = useState<Game | null>(null)
	const [loading, setLoading] = useState(true)
	const [copiedServerIds, setCopiedServerIds] = useState<Set<string>>(new Set())

	useEffect(() => {
		const loadGame = async () => {
			try {
				const gameData = await fetchGame(gameId)
				setGame(gameData)
			} catch (error) {
				console.error("Error fetching game:", error)
			} finally {
				setLoading(false)
			}
		}

		loadGame()
	}, [gameId])

	const handleServerClick = async (server: PrivateServer) => {
		await copyToClipboard(server.link)
		setCopiedServerIds(prev => new Set(prev).add(server.id))
		
		// Revert the button text back after 2 seconds
		setTimeout(() => {
			setCopiedServerIds(prev => {
				const newSet = new Set(prev)
				newSet.delete(server.id)
				return newSet
			})
		}, 2000)
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-950'>
				<Navbar />

				{/* Background pattern */}
				<div className='absolute inset-0 opacity-[0.02]'>
					<div
						className='absolute inset-0'
						style={{
							backgroundImage: `
								linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
								linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
							`,
							backgroundSize: "32px 32px",
						}}
					/>
				</div>

				<div className='relative z-10 container mx-auto px-4 py-8 max-w-6xl'>
					<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6 animate-pulse'>
						<div className='flex flex-col lg:flex-row gap-6'>
							<div className='w-full lg:w-80 aspect-square rounded-lg bg-gray-200/10'></div>
							<div className='flex-1'>
								<div className='h-8 bg-gray-200/10 rounded mb-4 w-64'></div>
								<div className='h-4 bg-gray-200/10 rounded mb-6 w-full'></div>
								<div className='grid grid-cols-3 gap-4'>
									<div className='h-16 bg-gray-200/10 rounded'></div>
									<div className='h-16 bg-gray-200/10 rounded'></div>
									<div className='h-16 bg-gray-200/10 rounded'></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!game) {
		notFound()
	}

	return (
		<div className='min-h-screen bg-gray-950'>
			<Navbar />

			{/* Background pattern */}
			<div className='absolute inset-0 opacity-[0.02]'>
				<div
					className='absolute inset-0'
					style={{
						backgroundImage: `
							linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
						`,
						backgroundSize: "32px 32px",
					}}
				/>
			</div>

			<div className='relative z-10 container mx-auto px-4 py-8 max-w-7xl'>
				{/* Back Button */}
				<div>
					<Link
						href='/games'
						className='inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group'
					>
						<ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
						Back to Games
					</Link>
				</div>

				{/* Two Column Layout */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8'>
					{/* LEFT COLUMN - Game Information */}
					<div className='lg:col-span-5 space-y-6'>
						{/* Game Header Card */}
						<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6'>
							{/* Game Image */}
							<div className='aspect-square rounded-lg overflow-hidden bg-white/[0.02] border border-gray-200/10 mb-6 group'>
								{game.image ? (
									<Image
										src={game.image}
										alt={game.name}
										width={512}
										height={512}
										className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
									/>
								) : (
									<div className='w-full h-full flex items-center justify-center text-gray-400'>
										<Server className='h-16 w-16' />
									</div>
								)}
							</div>

							{/* Game Title & Actions */}
							<div className='mb-6'>
								<h1 className='text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight'>
									{game.name}
								</h1>
								<p className='text-gray-400 text-lg mb-4'>
									Private servers available for this game
								</p>
								
								<Button
									className='w-full bg-white/10 hover:bg-white/20 text-white border-gray-200/10 transition-all duration-300 hover:scale-105 active:scale-95'
									size="lg"
									onClick={() =>
										window.open(
											`https://www.roblox.com/games/${game.gameid}`,
											"_blank"
										)
									}
								>
									<ExternalLink className='h-5 w-5 mr-2' />
									Play Game
								</Button>
							</div>

							{/* Game Stats Grid */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
								<div className='text-center p-4 rounded-lg bg-white/[0.02] border border-gray-200/10'>
									<div className='text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2 mb-1'>
										<RobuxIcon size={18} />
										{game.robux}
									</div>
									<div className='text-sm text-gray-400'>Cost</div>
								</div>
								<div className='text-center p-4 rounded-lg bg-white/[0.02] border border-gray-200/10'>
									<div className='text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2 mb-1'>
										<Users className='h-4 w-4 sm:h-5 sm:w-5' />
										{game.serverCount || 0}
									</div>
									<div className='text-sm text-gray-400'>Servers</div>
								</div>
							</div>

							{/* Game Details */}
							<div className='border-t border-gray-200/10 pt-4 space-y-3'>
								<div className='flex justify-between items-center text-sm'>
									<span className='text-gray-500'>Game ID:</span>
									<span className='text-gray-300 font-mono'>{game.gameid}</span>
								</div>
								<div className='flex justify-between items-center text-sm'>
									<span className='text-gray-500'>Created:</span>
									<span className='text-gray-300'>{formatTimeAgo(game.createdAt)}</span>
								</div>
								<div className='flex justify-between items-center text-sm'>
									<span className='text-gray-500'>Last Updated:</span>
									<span className='text-gray-300'>{formatTimeAgo(game.updatedAt)}</span>
								</div>
							</div>
						</div>

						{/* Server Statistics */}
						<div className='grid grid-cols-2 gap-4'>
							<motion.div 
								className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6 text-center hover:bg-white/[0.03] transition-all duration-300'
								whileHover={{ scale: 1.02 }}
								transition={{ duration: 0.2 }}
							>
								<Server className='h-8 w-8 text-blue-400 mx-auto mb-3' />
								<div className='text-2xl font-bold text-white'>
									{mockPrivateServers.length}
								</div>
								<div className='text-sm text-gray-400'>Available</div>
							</motion.div>

							<motion.div 
								className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6 text-center hover:bg-white/[0.03] transition-all duration-300'
								whileHover={{ scale: 1.02 }}
								transition={{ duration: 0.2 }}
							>
								<Clock className='h-8 w-8 text-purple-400 mx-auto mb-3' />
								<div className='text-2xl font-bold text-white'>
									{formatTimeAgo(
										mockPrivateServers[0]?.lastChecked || game.updatedAt
									)}
								</div>
								<div className='text-sm text-gray-400'>Last Check</div>
							</motion.div>
						</div>
					</div>

					{/* RIGHT COLUMN - Private Servers */}
					<div className='lg:col-span-7 space-y-6'>
						{/* Server List Header */}
						<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6'>
							<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
								<div>
									<h2 className='text-xl sm:text-2xl font-bold text-white mb-2'>
										Private Servers
									</h2>
									<p className='text-gray-400'>
										{mockPrivateServers.length} servers available
									</p>
								</div>
								<Button
									variant='outline'
									className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95'
								>
									<RefreshCw className='h-4 w-4 mr-2' />
									Refresh
								</Button>
							</div>
						</div>

						{/* Server List */}
						<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg overflow-hidden'>
							{mockPrivateServers.length === 0 ? (
								<div className='p-12 text-center'>
									<Server className='h-12 w-12 text-gray-600 mx-auto mb-4' />
									<h3 className='text-lg font-medium text-gray-400 mb-2'>
										No servers available
									</h3>
									<p className='text-gray-500'>
										Check back later for private servers
									</p>
								</div>
							) : (
								<div className='divide-y divide-gray-200/10'>
									{mockPrivateServers.map((server, index) => (
										<div
											key={server.id}
											className={`p-4 sm:p-6 transition-all duration-300 cursor-pointer group ${
												copiedServerIds.has(server.id) 
													? 'bg-green-500/10' 
													: 'hover:bg-white/5'
											}`}
											onClick={() => handleServerClick(server)}
										>
											<div className='flex flex-col gap-4'>
												<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
													<div className='flex-1'>
														<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2'>
															<h3 className='text-white font-semibold text-base sm:text-lg group-hover:text-blue-300 transition-colors'>
																{server.name}
															</h3>
															{server.lastChecked && (
																<div className='flex items-center text-xs sm:text-sm text-gray-400'>
																	<Clock className='h-3 w-3 mr-1' />
																	{formatTimeAgo(server.lastChecked)}
																</div>
															)}
														</div>
													</div>

													<motion.div
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
													>
														<Button
															className={`transition-all duration-300 ${
																copiedServerIds.has(server.id)
																	? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50'
																	: 'bg-white/10 hover:bg-white/20 text-white border-gray-200/10'
															}`}
															size='sm'
															onClick={(e) => {
																e.stopPropagation()
																handleServerClick(server)
															}}
														>
															{copiedServerIds.has(server.id) ? (
																<>
																	<Check className='h-4 w-4 mr-2' />
																	Copied
																</>
															) : (
																<>
																	<Copy className='h-4 w-4 mr-2' />
																	Copy Link
																</>
															)}
														</Button>
													</motion.div>
												</div>

												{/* Server Link */}
												<div>
													<Input
														value={server.link}
														readOnly
														className='bg-gray-900/50 border-gray-200/10 text-white font-mono text-sm hover:bg-gray-900/70 transition-colors cursor-pointer'
														onClick={(e) => {
															e.stopPropagation()
															e.currentTarget.select()
															handleServerClick(server)
														}}
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
