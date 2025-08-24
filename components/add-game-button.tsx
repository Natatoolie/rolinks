"use client"

import React, { useState } from "react"
import { Plus, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { RequestGameResponse } from "@/app/(frontend)/api/request-game/types"
import { authClient } from "@/utils/auth/auth-client"

export default function AddGameButton() {
	const [isOpen, setIsOpen] = useState(false)
	const [gameId, setGameId] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [result, setResult] = useState<RequestGameResponse | null>(null)
	const { data: session } = authClient.useSession()
	const user = session?.user

	const handleSignIn = async () => {
		try {
			await authClient.signIn.social({
				provider: "discord",
			})
		} catch (error) {
			console.error("Sign in failed:", error)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!user) {
			await handleSignIn()
			return
		}

		setIsSubmitting(true)
		setResult(null)

		const gameIdNumber = parseInt(gameId.trim(), 10)

		if (isNaN(gameIdNumber) || gameIdNumber <= 0) {
			setResult({
				success: false,
				message: "Please enter a valid game ID",
				error: "Invalid game ID",
			})
			setIsSubmitting(false)
			return
		}

		try {
			const response = await fetch("/api/request-game", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gameId: gameIdNumber,
				}),
			})

			const data: RequestGameResponse = await response.json()
			setResult(data)

			if (data.success) {
				// Clear form on success
				setGameId("")
			}
		} catch (error) {
			console.error("Request error:", error)
			setResult({
				success: false,
				message: "Failed to submit request. Please try again.",
				error: "Network error",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleClose = () => {
		setIsOpen(false)
		setResult(null)
		setGameId("")
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					className='bg-white/10 hover:bg-white/20 text-white border-gray-200/10'
					onClick={() => setIsOpen(true)}
				>
					<Plus className='h-4 w-4 mr-2' />
					Add Game
				</Button>
			</DialogTrigger>
			<DialogContent className='border border-gray-200/10 bg-gray-950/95 backdrop-blur-sm text-white max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-xl font-bold text-white'>
						Add New Game
					</DialogTitle>
					<DialogDescription className='text-gray-400'>
						The game will be{" "}
						<span className='bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text'>
							inactive
						</span>{" "}
						until approved.
					</DialogDescription>
				</DialogHeader>

				{result ? (
					<div className='space-y-4'>
						<div
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
								<p
									className={result.success ? "text-green-300" : "text-red-300"}
								>
									{result.message}
								</p>
							</div>
						</div>

						<div className='flex justify-end gap-3'>
							<Button
								type='button'
								variant='outline'
								onClick={handleClose}
								className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white'
							>
								Close
							</Button>
							{result.success && (
								<Button
									type='button'
									onClick={() => {
										setResult(null)
										setGameId("")
									}}
									className='bg-white/10 hover:bg-white/20 text-white border-gray-200/10'
								>
									<Plus className='h-4 w-4 mr-2' />
									Add Another
								</Button>
							)}
						</div>
					</div>
				) : (
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='gameId' className='text-gray-300'>
								Enter Place ID
							</Label>
							<Input
								id='gameId'
								type='text'
								placeholder='920587237'
								value={gameId}
								onChange={(e) => setGameId(e.target.value)}
								className='bg-gray-900/50 border-gray-200/10 text-white placeholder:text-gray-500'
								required
							/>
							<p className='text-xs text-gray-500'>
								Example: https://roblox.com/games/
								<strong className='bg-gradient-to-b from-gray-500 to-gray-600 text-transparent bg-clip-text'>
									123456789
								</strong>
								/game-name
							</p>
						</div>

						<div className='flex justify-end gap-3 pt-2'>
							<Button
								type='button'
								variant='outline'
								onClick={handleClose}
								disabled={isSubmitting}
								className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-50'
							>
								Cancel
							</Button>
							<Button
								type='submit'
								disabled={
									isSubmitting || (!user && false) || (user && !gameId.trim())
								}
								className='bg-green-600 hover:bg-green-700 text-white min-w-[120px] disabled:opacity-50'
							>
								{isSubmitting ? (
									<>
										<Loader2 className='h-4 w-4 mr-2 animate-spin' />
										Submitting...
									</>
								) : !user ? (
									<>
										<Check className='h-4 w-4 mr-2' />
										Sign In & Add
									</>
								) : (
									<>
										<Check className='h-4 w-4 mr-2' />
										Add Game
									</>
								)}
							</Button>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}
