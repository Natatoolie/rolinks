import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Navbar from "@/components/navbar"
import GamesCarousel from "@/components/games-carousel"
import SocialSection from "./SocialSection"
import FeaturesSection from "./FeaturesSection"

export default function LandingPage() {
	return (
		<div className='min-h-screen bg-gray-950'>
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
					<GamesCarousel />
				</section>

				{/* Enhanced Features Section */}
				<FeaturesSection />

				{/* Social Links */}
				<SocialSection />

				{/* CTA Section */}
				<section className='text-center'>
					<div className='bg-gray-900 rounded-2xl p-8 border border-gray-800'>
						<h2 className='text-2xl font-semibold text-white mb-4 tracking-tight'>
							Ready to Start Your Adventure?
						</h2>
						<p className='text-gray-300 text-lg mb-6'>
							Join thousands of players already exploring amazing private
							servers.
						</p>
						<Button
							size='lg'
							className='bg-blue-600 hover:bg-blue-700 text-white'
						>
							<Star className='h-5 w-5 mr-2' />
							Get Started Now
						</Button>
					</div>
				</section>

				{/* Footer */}
				<footer className='mt-16 pt-8 border-t border-gray-800 text-center text-gray-500'>
					<p>
						&copy; 2024 RoLinks. All rights reserved. Not affiliated with Roblox
						Corporation.
					</p>
				</footer>
			</div>
		</div>
	)
}
