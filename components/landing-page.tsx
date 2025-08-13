import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import GamesCarousel from "@/components/games-carousel"
import SocialSection from "./SocialSection"
import FeaturesSection from "./FeaturesSection"
import Link from "next/link"
import { fetchGames } from "@/utils/actions/fetchGames"

export default async function LandingPage() {
	const getGames = async () => {
		const response = await fetchGames()
		return response.docs
	}

	return (
		<div className='min-h-screen relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'>
			{/* Animated background elements */}
			<div className='absolute inset-0 overflow-hidden'>
				{/* Subtle grid pattern */}
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

				{/* Floating orbs */}
				<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse' />
				<div
					className='absolute top-3/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse'
					style={{ animationDelay: "2s" }}
				/>
				<div
					className='absolute top-1/2 left-3/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse'
					style={{ animationDelay: "4s" }}
				/>

				{/* Subtle noise texture */}
				<div
					className='absolute inset-0 opacity-[0.02]'
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			<div className='relative z-10'>
				<Navbar />
				<div className='container mx-auto px-4 py-8'>
					{/* Header */}
					<header className='text-center mb-16'>
						<h1 className='text-5xl md:text-6xl font-bold text-white tracking-tight mb-4'>
							The{" "}
							<span className='relative inline-block text-red-400 pb-2'>
								BIGGEST
								<svg
									className='absolute -bottom-1 -left-1 w-full h-3'
									viewBox='0 0 240 12'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									style={{ width: "calc(100% + 8px)" }}
								>
									<path
										d='M4 8C25 4 50 2 75 4C100 6 125 8 150 6C175 4 200 2 220 4C225 4.5 230 5 236 6'
										stroke='currentColor'
										strokeWidth='3'
										strokeLinecap='round'
										className='text-red-400'
										fill='none'
									/>
								</svg>
							</span>{" "}
							Roblox Server Archive
						</h1>
						<p className='text-lg text-gray-400 max-w-2xl mx-auto font-medium'>
							Discover, connect, and build your community with thousands of
							private servers.
						</p>
					</header>
					{/* Hero Section */}
					{/* Featured Games Carousel */}
					<section className='mb-20'>
						<h2 className='text-2xl font-semibold text-white text-center mb-12 tracking-tight'>
							Popular Games
						</h2>
						<GamesCarousel games={await getGames()} />
						<div className='text-center mt-12'>
							<Link href={"/games"}>
								<Button
									variant='default'
									size='lg'
									className='bg-red-800 hover:bg-red-700 text-white hover:cursor-pointer'
								>
									View All Games
									<ArrowRight className='h-4 w-4 ml-2' />
								</Button>
							</Link>
						</div>
					</section>
					{/* Enhanced Features Section */}
					<FeaturesSection />
					{/* Social Links */}
					<SocialSection />
					{/* CTA Section */}
					<section className='text-center'>
						<div className='bg-gray-900 rounded-2xl p-8 border border-gray-800'>
							<h2 className='text-2xl font-semibold text-white mb-4 tracking-tight'>
								Start your adventure in private.
							</h2>
							<p className='text-gray-300 text-lg mb-6'>
								Experience the best of Roblox without the public servers.
							</p>
							<Button
								size='lg'
								className='bg-blue-600 hover:bg-blue-700 text-white '
							>
								<ArrowRight className='h-5 w-5' />
								<span className=''>Get Started Now</span>
							</Button>
						</div>
					</section>
					{/* Footer */}
					<footer className='mt-16 pt-8 border-t border-gray-800 text-center text-gray-500'>
						<p>
							&copy; 2025 RoLinks. All rights reserved. Not affiliated with
							Roblox Corporation.
						</p>
					</footer>
				</div>
			</div>
		</div>
	)
}
