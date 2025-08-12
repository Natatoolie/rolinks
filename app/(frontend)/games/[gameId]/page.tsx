"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import {
	Clock,
	Server,
	ArrowLeft,
	ExternalLink,
	Copy,
	RefreshCw,
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

// Helper function to get image URL
const getImageUrl = (image: string | Media | undefined): string | null => {
	if (!image) return null
	return typeof image === "string" ? image : image.url || null
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

			<div className='relative z-10 container mx-auto px-4 py-8 max-w-6xl'>
				{/* Back Button */}
				<Link
					href='/games'
					className='inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6'
				>
					<ArrowLeft className='h-4 w-4' />
					Back to Games
				</Link>

				{/* Game Header */}
				<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6 mb-8'>
					<div className='flex flex-col lg:flex-row gap-6'>
						{/* Game Image */}
						<div className='w-full lg:w-80 aspect-square rounded-lg overflow-hidden bg-white/[0.02] border border-gray-200/10'>
							{getImageUrl(game.image) ? (
								<Image
									src={getImageUrl(game.image)!}
									alt={game.name}
									width={320}
									height={320}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-gray-400'>
									<Server className='h-12 w-12' />
								</div>
							)}
						</div>

						{/* Game Info */}
						<div className='flex-1'>
							<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4'>
								<div>
									<h1 className='text-3xl font-bold text-white mb-2'>
										{game.name}
									</h1>
									<p className='text-gray-400 text-lg mb-4'>
										Private servers available for {game.name}
									</p>
								</div>

								<Button
									className='bg-white/10 hover:bg-white/20 text-white border-gray-200/10 px-6'
									onClick={() =>
										window.open(
											`https://www.roblox.com/games/${game.gameid}`,
											"_blank"
										)
									}
								>
									<ExternalLink className='h-4 w-4 mr-2' />
									Play Game
								</Button>
							</div>

							{/* Game Stats Grid */}
							<div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6'>
								<div className='text-center'>
									<div className='text-2xl font-bold text-white flex items-center justify-center gap-1'>
										<RobuxIcon size={20} />
										{game.robux}
									</div>
									<div className='text-sm text-gray-400'>Cost</div>
								</div>
								<div className='text-center'>
									<div className='text-2xl font-bold text-white'>
										{game.serverCount || 0}
									</div>
									<div className='text-sm text-gray-400'>Private Servers</div>
								</div>
								<div className='text-center'>
									<div className='text-2xl font-bold text-white'>
										{formatTimeAgo(game.updatedAt)}
									</div>
									<div className='text-sm text-gray-400'>Last Updated</div>
								</div>
							</div>

							{/* Game Details */}
							<div className='flex flex-wrap gap-4 text-sm'>
								<div className='text-gray-400'>
									<span className='text-gray-500'>Game ID:</span> {game.gameid}
								</div>
								<div className='text-gray-400'>
									<span className='text-gray-500'>Created:</span>{" "}
									{formatTimeAgo(game.createdAt)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Server Statistics */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
					<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6 text-center'>
						<Server className='h-8 w-8 text-blue-400 mx-auto mb-2' />
						<div className='text-2xl font-bold text-white'>
							{mockPrivateServers.length}
						</div>
						<div className='text-sm text-gray-400'>Available Servers</div>
					</div>

					<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6 text-center'>
						<Clock className='h-8 w-8 text-purple-400 mx-auto mb-2' />
						<div className='text-2xl font-bold text-white'>
							{formatTimeAgo(
								mockPrivateServers[0]?.lastChecked || game.updatedAt
							)}
						</div>
						<div className='text-sm text-gray-400'>Last Updated</div>
					</div>
				</div>

				{/* Server List */}
				<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg'>
					<div className='p-6 border-b border-gray-200/10 flex items-center justify-between'>
						<div>
							<h2 className='text-xl font-semibold text-white'>
								Private Servers
							</h2>
							<p className='text-gray-400 text-sm'>
								Available servers for this game
							</p>
						</div>
						<Button
							variant='outline'
							className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white'
						>
							<RefreshCw className='h-4 w-4 mr-2' />
							Refresh
						</Button>
					</div>

					<div className='divide-y divide-gray-200/10'>
						{mockPrivateServers.map((server) => (
							<div
								key={server.id}
								className='p-6 hover:bg-white/5 transition-colors'
							>
								<div className='flex flex-col gap-4'>
									<div className='flex items-center justify-between'>
										<div className='flex-1'>
											<div className='flex items-center gap-3 mb-2'>
												<h3 className='text-white font-medium'>
													{server.name}
												</h3>
												{server.lastChecked && (
													<div className='flex items-center text-sm text-gray-400'>
														<Clock className='h-3 w-3 mr-1' />
														{formatTimeAgo(server.lastChecked)}
													</div>
												)}
											</div>
										</div>

										<Button
											className='bg-white/10 hover:bg-white/20 text-white border-gray-200/10'
											size='sm'
											onClick={() => copyToClipboard(server.link)}
										>
											<Copy className='h-4 w-4 mr-2' />
											Copy Link
										</Button>
									</div>

									{/* Copyable Server Link */}
									<div className='mt-3'>
										<Input
											value={server.link}
											readOnly
											className='bg-gray-900/50 border-gray-200/10 text-white font-mono text-sm'
											onClick={(e) => {
												e.currentTarget.select()
												copyToClipboard(server.link)
											}}
										/>
									</div>
								</div>
							</div>
						))}
					</div>

					{mockPrivateServers.length === 0 && (
						<div className='p-12 text-center'>
							<Server className='h-12 w-12 text-gray-600 mx-auto mb-4' />
							<h3 className='text-lg font-medium text-gray-400 mb-2'>
								No servers available
							</h3>
							<p className='text-gray-500'>
								Check back later for private servers
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
