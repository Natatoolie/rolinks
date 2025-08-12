"use client"

import { Button } from "@/components/ui/button"
import {
	Database,
	Menu,
	X,
	LogOut,
	User as UserIcon,
	Settings,
	ChevronDown,
} from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Discord icon component
const DiscordIcon = ({ className }: { className?: string }) => (
	<svg className={className} viewBox='0 0 24 24' fill='currentColor'>
		<path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z' />
	</svg>
)
import { useState } from "react"
import SearchDropdown from "@/components/search-dropdown"
import Link from "next/link"
import { authClient } from "@/utils/auth/auth-client"
import Image from "next/image"

// User Profile Component
const UserProfile = ({
	user,
	onSignOut,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	user: any
	onSignOut: () => void
}) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button
				variant='ghost'
				size='default'
				className='flex items-center space-x-2 text-gray-400 hover:text-white border border-none  backdrop-blur-sm hover:bg-white/5 transition-all duration-300 group px-3 py-2 rounded-lg shadow-sm'
			>
				{user ? (
					<Image
						src={user.image || ""}
						alt={user.name || "User"}
						width={256}
						height={256}
						className='w-8 h-8 rounded-full border-2 border-gray-600 group-hover:border-gray-500 transition-colors'
					/>
				) : (
					<div className='w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-600 group-hover:border-gray-500 transition-colors'>
						<UserIcon className='w-4 h-4 text-gray-300' />
					</div>
				)}
				<span className='text-white text-sm font-medium hidden xl:block'>
					{user.name || user.email}
				</span>
				<ChevronDown className='w-4 h-4 group-hover:scale-110 transition-transform duration-300' />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent
			align='end'
			className='w-56 border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm text-white shadow-xl'
		>
			<DropdownMenuLabel className='text-white'>
				{user.name || user.email}
			</DropdownMenuLabel>
			<DropdownMenuSeparator className='bg-gray-200/10' />
			<DropdownMenuItem asChild>
				<Link
					href='/settings'
					className='text-gray-400 hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white cursor-pointer flex items-center'
				>
					<Settings className='w-4 h-4 mr-2' />
					Settings
				</Link>
			</DropdownMenuItem>
			<DropdownMenuSeparator className='bg-gray-200/10' />
			<DropdownMenuItem
				onClick={onSignOut}
				variant='destructive'
				className='text-red-400 hover:bg-red-900/50 hover:text-red-300 focus:bg-red-900/50 focus:text-red-300 cursor-pointer'
			>
				<LogOut className='w-4 h-4 mr-2' />
				Sign Out
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
)

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { data: session, isPending: isLoading } = authClient.useSession()

	const user = session?.user

	const handleSignOut = async () => {
		try {
			await authClient.signOut()
		} catch (error) {
			console.error("Sign out failed:", error)
		}
	}

	const handleSignIn = async () => {
		try {
			await authClient.signIn.social({
				provider: "discord",
			})
		} catch (error) {
			console.error("Sign in failed:", error)
		}
	}

	return (
		<nav className='bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50 shadow-lg shadow-black/20'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center h-16'>
					{/* Logo and Navigation Group */}
					<div className='flex items-center space-x-8'>
						{/* Logo */}
						<Link
							href='/'
							className='group flex items-center hover:scale-105 transition-all duration-300 cursor-pointer'
						>
							<div className='relative'>
								<Database className='h-8 w-8 text-yellow-400 mr-3 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg' />
								<div className='absolute -inset-1 bg-yellow-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
							</div>
							<span className='text-white text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text group-hover:from-yellow-100 group-hover:to-white transition-all duration-300'>
								RoLinks
							</span>
						</Link>

						{/* Desktop Navigation - Hide on smaller screens to prevent squishing */}
						<div className='hidden lg:flex items-center space-x-1 xl:space-x-2'>
							<Link
								href='/'
								className='group relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 whitespace-nowrap rounded-lg hover:bg-gray-800/50'
							>
								<span className='relative z-10'>Home</span>
								<div className='absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
							</Link>
							<a
								href='/games'
								className='group relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 whitespace-nowrap rounded-lg hover:bg-gray-800/50'
							>
								<span className='relative z-10'>Browse Games</span>
								<div className='absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
							</a>
						</div>
					</div>

					{/* Search Bar and Right Side Content */}
					<div className='flex items-center flex-1 justify-end space-x-4'>
						{/* Search Bar - Responsive width */}
						<div className='hidden md:flex w-full max-w-xs lg:max-w-sm xl:max-w-md'>
							<SearchDropdown className='w-full' />
						</div>

						{/* Desktop Auth Section - Only show on large screens */}
						<div className='hidden lg:flex items-center flex-shrink-0'>
							{user ? (
								<UserProfile user={user} onSignOut={handleSignOut} />
							) : (
								<Button
									onClick={handleSignIn}
									size='lg'
									disabled={isLoading}
									className='bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 hover:scale-105 group disabled:hover:scale-100'
								>
									<DiscordIcon className='h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300' />
									<span className='text-lg'>
										{isLoading ? "Connecting..." : "Login"}
									</span>
								</Button>
							)}
						</div>

						{/* Mobile/Tablet menu button */}
						<div className='lg:hidden'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className='text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all duration-300 group relative'
							>
								<div className='relative'>
									{isMenuOpen ? (
										<X className='h-5 w-5 group-hover:rotate-90 transition-transform duration-300' />
									) : (
										<Menu className='h-5 w-5 group-hover:scale-110 transition-transform duration-300' />
									)}
								</div>
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile/Tablet Navigation - Positioned absolutely to prevent layout shift */}
				{isMenuOpen && (
					<div className='lg:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 z-40 shadow-2xl shadow-black/30'>
						<div className='container mx-auto px-4 py-4'>
							<div className='flex flex-col space-y-4'>
								{/* Mobile Search - Hide on medium screens where desktop search is visible */}
								<div className='md:hidden'>
									<SearchDropdown isMobile={true} className='w-full' />
								</div>

								{/* Navigation Links */}
								<div className='flex flex-col md:flex-row md:flex-wrap md:gap-x-6 space-y-2 md:space-y-0'>
									<Link
										href='/'
										className='group relative text-gray-300 hover:text-white transition-all duration-300 py-2 md:py-1 px-2 rounded-lg hover:bg-gray-800/40'
									>
										<span className='relative z-10'>Home</span>
										<div className='absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
									</Link>
									<a
										href='/games'
										className='group relative text-gray-300 hover:text-white transition-all duration-300 py-2 md:py-1 px-2 rounded-lg hover:bg-gray-800/40'
									>
										<span className='relative z-10'>Browse Games</span>
										<div className='absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
									</a>
								</div>

								{/* Auth Section - Show for all mobile/tablet screens since desktop auth is hidden until lg */}
								<div className='flex flex-col pt-4 border-t border-gray-200/10 space-y-4'>
									{user ? (
										<>
											{/* User Profile Card */}
											<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm rounded-lg p-4 shadow-sm'>
												<div className='flex items-center space-x-3'>
													{user.image ? (
														<Image
															src={user.image}
															alt={user.name || "User"}
															width={256}
															height={256}
															className='w-10 h-10 rounded-full border-2 border-gray-200/10'
														/>
													) : (
														<div className='w-10 h-10 rounded-full bg-white/[0.02] border border-gray-200/10 flex items-center justify-center'>
															<UserIcon className='w-5 h-5 text-gray-400' />
														</div>
													)}
													<div className='flex-1 min-w-0'>
														<div className='text-white font-medium truncate'>
															{user.name || user.email}
														</div>
														<div className='text-xs text-gray-400'>Signed in via Discord</div>
													</div>
												</div>
											</div>

											{/* Action Cards */}
											<div className='grid grid-cols-2 gap-3'>
												<Link
													href='/settings'
													className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/5 rounded-lg p-3 shadow-sm transition-colors group'
												>
													<div className='flex flex-col items-center text-center space-y-2'>
														<Settings className='w-5 h-5 text-gray-400 group-hover:text-white transition-colors' />
														<span className='text-xs text-gray-400 group-hover:text-white transition-colors font-medium'>Settings</span>
													</div>
												</Link>
												<button
													onClick={handleSignOut}
													className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm hover:bg-red-900/20 rounded-lg p-3 shadow-sm transition-colors group'
												>
													<div className='flex flex-col items-center text-center space-y-2'>
														<LogOut className='w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors' />
														<span className='text-xs text-red-400 group-hover:text-red-300 transition-colors font-medium'>Sign Out</span>
													</div>
												</button>
											</div>
										</>
									) : (
										<div className='border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm rounded-lg p-4 shadow-sm'>
											<Button
												onClick={handleSignIn}
												size='sm'
												disabled={isLoading}
												className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 justify-center group'
											>
												<DiscordIcon className='h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300' />
												{isLoading ? "Connecting..." : "Login with Discord"}
											</Button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}
