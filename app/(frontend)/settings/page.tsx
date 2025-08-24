"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	User,
	Monitor,
	Smartphone,
	LogOut,
	Trash2,
	Download,
	Shield,
	Settings as SettingsIcon,
} from "lucide-react"
import Image from "next/image"
import { authClient } from "@/utils/auth/auth-client"
import { useRouter } from "next/navigation"

interface SessionInfo {
	id: string
	userId: string
	userAgent: string
	ipAddress: string
	createdAt: string
	updatedAt: string
	isCurrent: boolean
}

export default function SettingsPage() {
	const router = useRouter()
	const { data: session, isPending: isLoading } = authClient.useSession()
	const [sessions, setSessions] = useState<SessionInfo[]>([])
	const [isSigningOut, setIsSigningOut] = useState(false)
	const [isDeletingAccount, setIsDeletingAccount] = useState(false)
	const [isRemovingSessions, setIsRemovingSessions] = useState(false)
	const [deleteConfirmation, setDeleteConfirmation] = useState("")
	const [isExporting, setIsExporting] = useState(false)

	const user = session?.user

	// Redirect if not authenticated
	useEffect(() => {
		if (!isLoading && !user) {
			router.push("/")
		}
	}, [user, isLoading, router])

	// Fetch real session data
	useEffect(() => {
		if (user) {
			const fetchSessions = async () => {
				try {
					const response = await fetch("/api/settings/sessions")
					if (response.ok) {
						const data = await response.json()
						setSessions(data.sessions || [])
					} else {
						console.error("Failed to fetch sessions")
					}
				} catch (error) {
					console.error("Error fetching sessions:", error)
				}
			}

			fetchSessions()
		}
	}, [user])

	const handleSignOut = async () => {
		setIsSigningOut(true)
		try {
			await authClient.signOut()
			router.push("/")
		} catch (error) {
			console.error("Sign out failed:", error)
		} finally {
			setIsSigningOut(false)
		}
	}

	const handleRemoveAllSessions = async () => {
		setIsRemovingSessions(true)
		try {
			const response = await fetch("/api/settings/sessions", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (response.ok) {
				// Refresh sessions data
				const sessionsResponse = await fetch("/api/settings/sessions")
				if (sessionsResponse.ok) {
					const data = await sessionsResponse.json()
					setSessions(data.sessions || [])
				}
			} else {
				console.error("Failed to remove sessions")
			}
		} catch (error) {
			console.error("Failed to remove sessions:", error)
		} finally {
			setIsRemovingSessions(false)
		}
	}

	const handleRemoveSession = async (sessionId: string) => {
		try {
			const response = await fetch(`/api/settings/sessions/${sessionId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (response.ok) {
				// Remove session from local state
				setSessions((prev) =>
					prev.filter((session) => session.id !== sessionId)
				)
			} else {
				console.error("Failed to remove session")
			}
		} catch (error) {
			console.error("Failed to remove session:", error)
		}
	}

	const handleExportData = async () => {
		setIsExporting(true)
		try {
			// Mock export data - replace with actual API call
			const userData = {
				profile: {
					id: user?.id,
					name: user?.name,
					email: user?.email,
					createdAt: user?.createdAt,
				},
				settings: {
					// Add user settings here
				},
				activityLog: {
					// Add activity log here
				},
			}
			setExportData(userData)

			// Create and download file
			const dataStr = JSON.stringify(userData, null, 2)
			const dataBlob = new Blob([dataStr], { type: "application/json" })
			const url = URL.createObjectURL(dataBlob)
			const link = document.createElement("a")
			link.href = url
			link.download = `rolinks-data-export-${new Date().toISOString().split("T")[0]}.json`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error("Export failed:", error)
		} finally {
			setIsExporting(false)
		}
	}

	const handleDeleteAccount = async () => {
		if (deleteConfirmation !== "DELETE") {
			return
		}

		setIsDeletingAccount(true)
		try {
			// API call to delete account
			await new Promise((resolve) => setTimeout(resolve, 2000)) // Mock delay
			// After successful deletion, sign out and redirect
			await authClient.signOut()
			router.push("/")
		} catch (error) {
			console.error("Account deletion failed:", error)
		} finally {
			setIsDeletingAccount(false)
		}
	}

	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return "Unknown"
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		})
	}

	const parseUserAgent = (userAgent: string) => {
		// Basic user agent parsing
		const isChrome = userAgent.includes("Chrome")
		const isFirefox = userAgent.includes("Firefox")
		const isSafari =
			userAgent.includes("Safari") && !userAgent.includes("Chrome")
		const isEdge = userAgent.includes("Edg")

		const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
		const isWindows = userAgent.includes("Windows")
		const isMac = userAgent.includes("Mac OS")
		const isLinux = userAgent.includes("Linux")
		const isAndroid = userAgent.includes("Android")
		const isiOS = userAgent.includes("iPhone") || userAgent.includes("iPad")

		let browser = "Unknown Browser"
		if (isChrome) browser = "Chrome"
		else if (isFirefox) browser = "Firefox"
		else if (isSafari) browser = "Safari"
		else if (isEdge) browser = "Edge"

		let os = "Unknown OS"
		if (isWindows) os = "Windows"
		else if (isMac) os = "macOS"
		else if (isLinux) os = "Linux"
		else if (isAndroid) os = "Android"
		else if (isiOS) os = "iOS"

		return {
			browser,
			os,
			deviceType: isMobile ? "Mobile" : "Desktop",
		}
	}

	const getDeviceIcon = (deviceType: string) => {
		return deviceType.toLowerCase().includes("mobile") ? (
			<Smartphone className='w-4 h-4 text-gray-300' />
		) : (
			<Monitor className='w-4 h-4 text-gray-300' />
		)
	}

	const formatLastActivity = (updatedAt: string) => {
		const now = new Date()
		const updated = new Date(updatedAt)
		const diffMs = now.getTime() - updated.getTime()
		const diffMinutes = Math.floor(diffMs / (1000 * 60))
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

		if (diffMinutes < 5) return "Active now"
		if (diffMinutes < 60) return `${diffMinutes} minutes ago`
		if (diffHours < 24) return `${diffHours} hours ago`
		return `${diffDays} days ago`
	}

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center'>
				<motion.div
					className='w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full'
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				/>
			</div>
		)
	}

	if (!user) {
		return null
	}

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const cardVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	}

	return (
		<div className='min-h-screen bg-gray-950'>
			{/* Subtle background pattern */}
			<div className='absolute inset-0 opacity-[0.02]'>
				<div
					className='h-full w-full'
					style={{
						backgroundImage: `
							linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
						`,
						backgroundSize: "32px 32px",
					}}
				/>
			</div>

			<div className='relative'>
				<motion.div
					className='container mx-auto px-4 py-12 max-w-4xl'
					variants={containerVariants}
					initial='hidden'
					animate='visible'
				>
					{/* Clean Header */}
					<motion.div className='mb-12' variants={cardVariants}>
						<div className='flex items-center space-x-4 mb-4'>
							<div className='w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700'>
								<SettingsIcon className='w-5 h-5 text-gray-300' />
							</div>
							<div>
								<h1 className='text-3xl font-bold text-white'>
									Account Settings
								</h1>
								<p className='text-gray-400'>
									Manage your account, sessions, and preferences
								</p>
							</div>
						</div>
					</motion.div>

					<div className='space-y-12'>
						{/* Account Information */}
						<motion.div variants={cardVariants}>
							<Card className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm'>
								<CardHeader className='pb-6'>
									<CardTitle className='text-lg font-semibold text-white'>
										Profile
									</CardTitle>
									<CardDescription className='text-gray-400'>
										Manage your account information and preferences
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-6'>
									<div className='flex items-start space-x-4'>
										<div className='relative flex-shrink-0'>
											{user.image ? (
												<Image
													src={user.image}
													alt={user.name || "User"}
													width={64}
													height={64}
													className='w-16 h-16 rounded-full'
												/>
											) : (
												<div className='w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center'>
													<User className='w-6 h-6 text-gray-400' />
												</div>
											)}
											<div className='absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center'>
												<Shield className='w-2.5 h-2.5 text-white' />
											</div>
										</div>
										<div className='min-w-0 flex-1'>
											<div className='mb-3'>
												<h3 className='text-base font-medium text-white'>
													{user.name || "Unknown User"}
												</h3>
												<p className='text-sm text-gray-400'>
													{user.email || "No email"}
												</p>
											</div>
											<div className='flex flex-wrap gap-2'>
												<Badge
													variant='secondary'
													className='bg-gray-800/50 text-gray-300 border-gray-700/50 text-xs'
												>
													Discord
												</Badge>
												<Badge
													variant='secondary'
													className='bg-green-900/30 text-green-400 border-green-800/50 text-xs'
												>
													Verified
												</Badge>
											</div>
										</div>
									</div>

									<div className='border-t border-gray-200/10 pt-6'>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
											<div className='space-y-1'>
												<Label className='text-xs font-medium text-gray-400 uppercase tracking-wide'>
													Member Since
												</Label>
												<p className='text-sm text-white'>
													{formatDate(user.createdAt.toString())}
												</p>
											</div>
											<div className='space-y-1'>
												<Label className='text-xs font-medium text-gray-400 uppercase tracking-wide'>
													Last Active
												</Label>
												<p className='text-sm text-white'>
													{formatDate(user.updatedAt.toString())}
												</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Session Management */}
						<motion.div variants={cardVariants}>
							<Card className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm'>
								<CardHeader className='pb-6'>
									<div className='flex items-center justify-between'>
										<div>
											<CardTitle className='text-lg font-semibold text-white'>
												Sessions
											</CardTitle>
											<CardDescription className='text-gray-400'>
												Manage your active sessions across devices
											</CardDescription>
										</div>
										<Button
											variant='outline'
											size='sm'
											onClick={handleRemoveAllSessions}
											disabled={isRemovingSessions || sessions.length <= 1}
											className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white text-xs'
										>
											{isRemovingSessions ? (
												<motion.div
													className='w-3 h-3 border border-gray-400 border-t-transparent rounded-full mr-2'
													animate={{ rotate: 360 }}
													transition={{
														duration: 1,
														repeat: Infinity,
														ease: "linear",
													}}
												/>
											) : (
												<LogOut className='w-3 h-3 mr-2' />
											)}
											Revoke all
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									{sessions.length > 0 ? (
										<div className='space-y-3'>
											{sessions.map((session, index) => {
												const { browser, os, deviceType } = parseUserAgent(
													session.userAgent
												)
												const lastActivity = formatLastActivity(
													session.updatedAt
												)

												return (
													<motion.div
														key={session.id}
														initial={{ opacity: 0, y: 5 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: index * 0.05 }}
														className={`flex items-center justify-between p-3 rounded-lg border ${
															session.isCurrent
																? "border-gray-200/20 bg-white/[0.02]"
																: "border-gray-200/10 bg-white/[0.01]"
														} hover:border-gray-200/20 transition-colors`}
													>
														<div className='flex items-center space-x-3'>
															<div className='flex-shrink-0'>
																{getDeviceIcon(deviceType)}
															</div>
															<div className='min-w-0 flex-1'>
																<div className='flex items-center space-x-2'>
																	<p className='text-sm font-medium text-white truncate'>
																		{browser} on {os}
																	</p>
																	{session.isCurrent && (
																		<Badge
																			variant='secondary'
																			className='bg-green-900/30 text-green-400 border-green-800/50 text-xs px-1.5 py-0.5'
																		>
																			Current
																		</Badge>
																	)}
																</div>
																<p className='text-xs text-gray-400 truncate'>
																	{session.ipAddress} • {lastActivity}
																</p>
															</div>
														</div>
														{!session.isCurrent && (
															<Button
																variant='ghost'
																size='sm'
																onClick={() => handleRemoveSession(session.id)}
																className='h-8 w-8 p-0 text-gray-500 hover:text-red-400 hover:bg-red-950/20'
															>
																<LogOut className='w-3 h-3' />
															</Button>
														)}
													</motion.div>
												)
											})}
										</div>
									) : (
										<div className='text-center py-12 text-gray-500'>
											<Monitor className='w-8 h-8 mx-auto mb-3 opacity-50' />
											<p className='text-sm'>No active sessions</p>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>

						{/* Account Actions */}
						<motion.div variants={cardVariants}>
							<Card className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm'>
								<CardHeader className='pb-6'>
									<CardTitle className='text-lg font-semibold text-white'>
										Security
									</CardTitle>
									<CardDescription className='text-gray-400'>
										Manage your account security and data
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-6'>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
										{/* Export Data */}
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant='outline'
													className='h-auto p-4 bg-transparent border-gray-200/10 text-left justify-start hover:bg-white/5'
												>
													<div className='flex items-center space-x-3'>
														<Download className='w-4 h-4 text-gray-400 flex-shrink-0' />
														<div className='min-w-0'>
															<div className='text-sm font-medium text-white'>
																Export data
															</div>
															<div className='text-xs text-gray-500'>
																Download your information
															</div>
														</div>
													</div>
												</Button>
											</DialogTrigger>
											<DialogContent className='border border-gray-200/10 bg-gray-950/95 backdrop-blur-sm text-white'>
												<DialogHeader>
													<DialogTitle className='text-lg font-semibold'>
														Export your data
													</DialogTitle>
													<DialogDescription className='text-gray-400'>
														Download a copy of your account information.
													</DialogDescription>
												</DialogHeader>
												<div className='space-y-4'>
													<div className='p-4 rounded-lg border border-gray-200/10 bg-white/[0.02]'>
														<p className='text-sm text-gray-300'>
															Your export will include profile information,
															session history, and account activity in JSON
															format.
														</p>
													</div>
												</div>
												<DialogFooter>
													<Button
														onClick={handleExportData}
														disabled={isExporting}
														className='bg-white/10 hover:bg-white/20 text-white border-gray-200/10'
													>
														{isExporting ? (
															<motion.div
																className='w-4 h-4 border border-gray-300 border-t-transparent rounded-full mr-2'
																animate={{ rotate: 360 }}
																transition={{
																	duration: 1,
																	repeat: Infinity,
																	ease: "linear",
																}}
															/>
														) : (
															<Download className='w-4 h-4 mr-2' />
														)}
														Export
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>

										{/* Sign Out */}
										<Button
											variant='outline'
											onClick={handleSignOut}
											disabled={isSigningOut}
											className='h-auto p-4 bg-transparent border-gray-200/10 text-left justify-start hover:bg-white/5'
										>
											<div className='flex items-center space-x-3'>
												{isSigningOut ? (
													<motion.div
														className='w-4 h-4 border border-gray-400 border-t-transparent rounded-full flex-shrink-0'
														animate={{ rotate: 360 }}
														transition={{
															duration: 1,
															repeat: Infinity,
															ease: "linear",
														}}
													/>
												) : (
													<LogOut className='w-4 h-4 text-gray-400 flex-shrink-0' />
												)}
												<div className='min-w-0'>
													<div className='text-sm font-medium text-white'>
														{isSigningOut ? "Signing out..." : "Sign out"}
													</div>
													<div className='text-xs text-gray-500'>
														End your current session
													</div>
												</div>
											</div>
										</Button>
									</div>

									<div className='border-t border-gray-200/10 pt-6'>
										<div className='space-y-4'>
											<div>
												<h4 className='text-sm font-medium text-red-400 mb-1'>
													Danger zone
												</h4>
												<p className='text-xs text-gray-500 mb-4'>
													These actions are permanent and cannot be undone.
												</p>
											</div>

											<div className='p-4 rounded-lg border border-red-900/20 bg-red-950/10'>
												<div className='flex items-start justify-between'>
													<div className='min-w-0 flex-1'>
														<h5 className='text-sm font-medium text-red-300'>
															Delete account
														</h5>
														<p className='text-xs text-gray-500 mt-1'>
															Permanently delete your account and all data.
														</p>
													</div>
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant='destructive'
																size='sm'
																className='ml-3 bg-red-900/50 hover:bg-red-900/70 text-red-300 border-red-800/50 text-xs px-3 py-1.5'
															>
																Delete
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent className='border border-gray-200/10 bg-gray-950/95 backdrop-blur-sm text-white'>
															<AlertDialogHeader>
																<AlertDialogTitle className='text-red-400'>
																	Delete account
																</AlertDialogTitle>
																<AlertDialogDescription className='text-gray-400'>
																	This will permanently delete your account and
																	all associated data. This action cannot be
																	undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<div className='space-y-4'>
																<div className='p-4 rounded-lg border border-red-900/20 bg-red-950/20'>
																	<Label
																		htmlFor='confirmation'
																		className='text-sm text-gray-300'
																	>
																		Type{" "}
																		<span className='font-mono font-semibold text-red-300'>
																			DELETE
																		</span>{" "}
																		to confirm:
																	</Label>
																	<Input
																		id='confirmation'
																		value={deleteConfirmation}
																		onChange={(e) =>
																			setDeleteConfirmation(e.target.value)
																		}
																		placeholder='DELETE'
																		className='mt-2 bg-gray-900/50 border-gray-200/10 text-white'
																	/>
																</div>
															</div>
															<AlertDialogFooter>
																<AlertDialogCancel className='bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5'>
																	Cancel
																</AlertDialogCancel>
																<AlertDialogAction
																	onClick={handleDeleteAccount}
																	disabled={
																		deleteConfirmation !== "DELETE" ||
																		isDeletingAccount
																	}
																	className='bg-red-900/50 hover:bg-red-900/70 text-red-300'
																>
																	{isDeletingAccount ? (
																		<motion.div
																			className='w-4 h-4 border border-red-300 border-t-transparent rounded-full mr-2'
																			animate={{ rotate: 360 }}
																			transition={{
																				duration: 1,
																				repeat: Infinity,
																				ease: "linear",
																			}}
																		/>
																	) : (
																		<Trash2 className='w-4 h-4 mr-2' />
																	)}
																	Delete account
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	)
}
