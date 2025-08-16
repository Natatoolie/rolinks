"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState, useTransition } from "react"
import { motion } from "framer-motion"
import {
	Clock,
	Server,
	ArrowLeft,
	ExternalLink,
	Copy,
	Users,
	Check,
	ChevronLeft,
	ChevronRight,
	Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RobuxIcon } from "@/components/ui/robux-icon"
import { Game, Server as ServerType } from "@/payload-types"
import { fetchServerListData } from "@/utils/actions/getGameData"
import { authClient } from "@/utils/auth/auth-client"

type ServerData = {
	servers: ServerType[]
	totalPages: number
	currentPage: number | undefined
	totalDocs: number
	hasNextPage: boolean
	hasPrevPage: boolean
}

type GamePageProps = {
	game: Game
	initialServerData: ServerData | null
}

const ServerSkeleton = () => (
	<div className='p-4 sm:p-6 animate-pulse'>
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='flex-1'>
					<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2'>
						<div className='h-6 bg-gray-700 rounded w-32'></div>
						<div className='h-4 bg-gray-700 rounded w-20'></div>
					</div>
				</div>
				<div className='h-9 bg-gray-700 rounded w-24'></div>
			</div>
			<div className='h-10 bg-gray-700 rounded'></div>
		</div>
	</div>
)

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

export default function GamesClientPage({
	game,
	initialServerData,
}: GamePageProps) {
	const [serverData, setServerData] = useState<ServerData | null>(
		initialServerData
	)
	const [copiedServerIds, setCopiedServerIds] = useState<Set<string>>(new Set())
	const [currentPage, setCurrentPage] = useState(1)
	const [isPending, startTransition] = useTransition()

	const { data: user } = authClient.useSession()

	const loadServerPage = async (page: number) => {
		startTransition(async () => {
			try {
				const newData = await fetchServerListData({ gameId: game.gameid, page })
				if (newData) {
					setServerData(newData)
					setCurrentPage(page)
				}
			} catch (error) {
				console.error("Failed to load servers:", error)
			}
		})
	}

	const handleServerClick = async (server: ServerType) => {
		await copyToClipboard(server.link)
		setCopiedServerIds((prev) => new Set(prev).add(server.id))

		setTimeout(() => {
			setCopiedServerIds((prev) => {
				const newSet = new Set(prev)
				newSet.delete(server.id)
				return newSet
			})
		}, 2000)
	}

	return (
		<div className='min-h-screen bg-gray-950'>
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
									size='lg'
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
										{serverData?.totalDocs || 0}
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
									<span className='text-gray-300'>
										{formatTimeAgo(game.createdAt)}
									</span>
								</div>
								<div className='flex justify-between items-center text-sm'>
									<span className='text-gray-500'>Last Updated:</span>
									<span className='text-gray-300'>
										{formatTimeAgo(game.updatedAt)}
									</span>
								</div>
							</div>
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
										{serverData?.totalDocs || 0} servers available
									</p>
								</div>
								{user?.user === undefined ? (
									<Button
										disabled={user?.user === undefined}
										variant='outline'
										className='bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30 hover:text-green-300 hover:border-green-400/50 transition-all duration-300 hover:scale-105 active:scale-95'
									>
										<Plus className='h-4 w-4 mr-2' />
										Add Server
									</Button>
								) : (
									<Link href={`/games/${game.gameid}/add-server`}>
										<Button
											disabled={user?.user === undefined}
											variant='outline'
											className='bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30 hover:text-green-300 hover:border-green-400/50 transition-all duration-300 hover:scale-105 active:scale-95'
										>
											<Plus className='h-4 w-4 mr-2' />
											Add Server
										</Button>
									</Link>
								)}
							</div>
						</div>

						{/* Server List */}
						<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg overflow-hidden'>
							{isPending ? (
								<div className='divide-y divide-gray-200/10'>
									{Array.from({ length: 5 }).map((_, i) => (
										<ServerSkeleton key={i} />
									))}
								</div>
							) : !serverData || serverData.servers.length === 0 ? (
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
									{serverData.servers.map((server) => (
										<div
											key={server.id}
											className={`p-4 sm:p-6 transition-all duration-300 cursor-pointer group ${
												copiedServerIds.has(server.id)
													? "bg-green-500/10"
													: "hover:bg-white/5"
											}`}
											onClick={() => handleServerClick(server)}
										>
											<div className='flex flex-col gap-4'>
												<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
													<div className='flex-1'>
														<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2'>
															<h3 className='text-white font-semibold text-base sm:text-lg group-hover:text-blue-300 transition-colors'>
																{server.name || `Server ${server.id}`}
															</h3>
															{server.checkedAt && (
																<div className='flex items-center text-xs sm:text-sm text-gray-400'>
																	<Clock className='h-3 w-3 mr-1' />
																	{formatTimeAgo(server.checkedAt)}
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
																	? "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50"
																	: "bg-white/10 hover:bg-white/20 text-white border-gray-200/10"
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

						{/* Pagination */}
						{serverData && serverData.totalPages > 1 && (
							<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-4'>
								<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
									<div className='text-sm text-gray-400'>
										Page {serverData.currentPage} of {serverData.totalPages} (
										{serverData.totalDocs} total servers)
									</div>
									<div className='flex items-center gap-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => loadServerPage(currentPage - 1)}
											disabled={!serverData.hasPrevPage || isPending}
											className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-50'
										>
											<ChevronLeft className='h-4 w-4 mr-1' />
											Previous
										</Button>
										<div className='flex items-center gap-1'>
											{Array.from(
												{ length: Math.min(5, serverData.totalPages) },
												(_, i) => {
													const page = i + 1
													return (
														<Button
															key={page}
															variant={
																page === serverData.currentPage
																	? "default"
																	: "outline"
															}
															size='sm'
															onClick={() => loadServerPage(page)}
															disabled={isPending}
															className={`w-8 h-8 p-0 ${
																page === serverData.currentPage
																	? "bg-white/20 text-white"
																	: "bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white"
															}`}
														>
															{page}
														</Button>
													)
												}
											)}
										</div>
										<Button
											variant='outline'
											size='sm'
											onClick={() => loadServerPage(currentPage + 1)}
											disabled={!serverData.hasNextPage || isPending}
											className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-50'
										>
											Next
											<ChevronRight className='h-4 w-4 ml-1' />
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
