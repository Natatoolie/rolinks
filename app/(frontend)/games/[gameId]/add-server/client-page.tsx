"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
	ArrowLeft,
	Plus,
	Trash2,
	Check,
	X,
	Server,
	Loader2,
	ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Game } from "@/payload-types"
import {
	AddServerResponse,
	ServerResult,
} from "@/app/(frontend)/api/add-server/types"
import { useRouter } from "next/navigation"

type AddServerClientProps = {
	game: Game
}

type ServerForm = {
	id: string
	link: string
}

// Using imported ServerResult type instead of local SubmissionResult

export default function AddServerClient({ game }: AddServerClientProps) {
	const [servers, setServers] = useState<ServerForm[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [results, setResults] = useState<ServerResult[]>([])
	const [showResults, setShowResults] = useState(false)
	const [isClient, setIsClient] = useState(false)
	const router = useRouter()

	// Initialize servers on client-side only to avoid hydration mismatch
	useEffect(() => {
		setIsClient(true)
		setServers([{ id: crypto.randomUUID(), link: "" }])
	}, [])

	const addServerForm = () => {
		setServers([...servers, { id: crypto.randomUUID(), link: "" }])
	}

	const removeServerForm = (id: string) => {
		if (servers.length > 1) {
			setServers(servers.filter((server) => server.id !== id))
		}
	}

	const updateServer = (id: string, value: string) => {
		setServers(
			servers.map((server) =>
				server.id === id ? { ...server, link: value } : server
			)
		)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setShowResults(false)

		// Filter out empty servers
		const validServers = servers.filter((server) => server.link.trim())

		if (validServers.length === 0) {
			setIsSubmitting(false)
			return
		}

		try {
			const response = await fetch("/api/add-server", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gameId: game.gameid,
					servers: validServers.map(({ link }) => ({
						link,
					})),
				}),
			})

			if (response.status === 401) {
				// Redirect to login
				router.push("/")
				return
			}

			if (response.status === 429) {
				// Rate limited
				const errorData = await response.json()
				alert(`Rate limit exceeded: ${errorData.message || errorData.error || 'Please try again later'}`)
				setIsSubmitting(false)
				return
			}

			const data: AddServerResponse = await response.json()

			if (response.ok) {
				setResults(data.results)
				setShowResults(true)
				// Clear successful entries, keep failed ones
				const failedServerIds = data.results
					.filter((result: ServerResult) => !result.success)
					.map((result: ServerResult) => {
						const originalServer = validServers.find(
							(s) => s.link === result.input?.link
						)
						return originalServer?.id
					})

				if (failedServerIds.length === 0) {
					// All successful, reset form
					setServers([{ id: crypto.randomUUID(), link: "" }])
				} else {
					// Keep failed servers
					setServers([
						...servers.filter((s) => failedServerIds.includes(s.id)),
						{ id: crypto.randomUUID(), link: "" },
					])
				}
			}
		} catch (error) {
			console.error("Submission error:", error)
		} finally {
			setIsSubmitting(false)
		}
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

			<div className='relative z-10 container mx-auto px-4 py-8 max-w-4xl'>
				{/* Back Button */}
				<div>
					<Link
						href={`/games/${game.gameid}`}
						className='inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group'
					>
						<ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
						Back to {game.name}
					</Link>
				</div>

				{/* Game Header */}
				<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6 mb-6'>
					<div className='flex items-center gap-4'>
						<div className='w-16 h-16 rounded-lg overflow-hidden bg-white/[0.02] border border-gray-200/10 flex-shrink-0'>
							{game.image ? (
								<Image
									src={game.image}
									alt={game.name}
									width={64}
									height={64}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-gray-400'>
									<Server className='h-6 w-6' />
								</div>
							)}
						</div>
						<div>
							<h1 className='text-2xl font-bold text-white mb-1'>
								Add Private Servers
							</h1>
							<p className='text-gray-400'>
								Adding servers for{" "}
								<span className='text-white font-medium'>{game.name}</span>
							</p>
						</div>
					</div>
				</div>

				{/* Results Display */}
				<AnimatePresence>
					{showResults && results.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6 mb-6'
						>
							<h2 className='text-lg font-semibold text-white mb-4'>
								Submission Results
							</h2>
							<div className='space-y-3'>
								{results.map((result, index) => (
									<div
										key={index}
										className={`p-4 rounded-lg border ${
											result.success
												? "bg-green-500/10 border-green-500/30"
												: "bg-red-500/10 border-red-500/30"
										}`}
									>
										<div className='flex items-center gap-3'>
											{result.success ? (
												<Check className='h-5 w-5 text-green-400 flex-shrink-0' />
											) : (
												<X className='h-5 w-5 text-red-400 flex-shrink-0' />
											)}
											<div className='flex-1'>
												{result.success ? (
													<div>
														<p className='text-green-300 font-medium'>
															{result.server?.name}
														</p>
														<p className='text-green-400/80 text-sm font-mono break-all'>
															{result.server?.link}
														</p>
													</div>
												) : (
													<div>
														<p className='text-red-300 font-medium break-all'>
															{result.input?.link || "Unknown server"}
														</p>
														<p className='text-red-400/80 text-sm'>
															{result.error}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Add Servers Form */}
				<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm rounded-lg p-6'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-xl font-semibold text-white'>Server Links</h2>
						<Button
							type='button'
							variant='outline'
							onClick={addServerForm}
							disabled={!isClient}
							className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-50'
						>
							<Plus className='h-4 w-4 mr-2' />
							Add Another
						</Button>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6'>
						{!isClient ? (
							<div className='border border-gray-200/10 bg-white/[0.01] rounded-lg p-4'>
								<div className='flex items-center justify-between gap-4'>
									<div className='flex-1'>
										<div className='h-6 bg-gray-700 rounded w-20 mb-2'></div>
										<div className='h-10 bg-gray-700 rounded'></div>
									</div>
								</div>
							</div>
						) : (
							<AnimatePresence>
								{servers.map((server, index) => (
									<motion.div
										key={server.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										className='border border-gray-200/10 bg-white/[0.01] rounded-lg p-4'
									>
										<div className='flex items-center justify-between gap-4'>
											<div className='flex-1'>
												<Label className='text-gray-300 mb-2 block'>
													Link #{index + 1}
												</Label>
												<Input
													id={`${server.id}`}
													type='text'
													placeholder='https://www.roblox.com/games/...'
													value={server.link}
													onChange={(e) =>
														updateServer(server.id, e.target.value)
													}
													className='bg-gray-900/50 border-gray-200/10 text-white placeholder:text-gray-500 font-mono'
													required
												/>
											</div>
											{servers.length > 1 && (
												<Button
													type='button'
													variant='ghost'
													size='sm'
													onClick={() => removeServerForm(server.id)}
													className='text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-6'
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											)}
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						)}

						<div className='flex justify-end pt-4'>
							<Button
								type='submit'
								disabled={isSubmitting || !isClient}
								className='bg-green-600 hover:bg-green-700 text-white min-w-[120px] disabled:opacity-50'
							>
								{isSubmitting ? (
									<>
										<Loader2 className='h-4 w-4 mr-2 animate-spin' />
										Submitting...
									</>
								) : (
									<>
										<Check className='h-4 w-4 mr-2' />
										Submit Servers
									</>
								)}
							</Button>
						</div>
					</form>
				</div>

				{/* Game Link */}
				<div className='mt-6 text-center'>
					<Link
						href={`https://www.roblox.com/games/${game.gameid}`}
						target='_blank'
						className='inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm'
					>
						<ExternalLink className='h-4 w-4' />
						Open {game.name} on Roblox
					</Link>
				</div>
			</div>
		</div>
	)
}
