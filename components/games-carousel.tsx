"use client"

import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchGames } from "@/utils/actions/fetchGames"
import { Game } from "@/payload-types"
import GameCard from "./GameCard"

export default function GamesCarousel() {
	const [games, setGames] = useState<Game[]>([])
	const [loading, setLoading] = useState(true)
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "start",
		skipSnaps: false,
		dragFree: true,
		slidesToScroll: 1,
		containScroll: "trimSnaps",
	})

	const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
	const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

	useEffect(() => {
		const getGames = async () => {
			try {
				setLoading(true)
				const response = await fetchGames()
				console.log(response)
				setGames(response.docs || [])
			} catch (error) {
				console.error("Error fetching games:", error)
			} finally {
				setLoading(false)
			}
		}

		getGames()
	}, [])

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev()
	}, [emblaApi])

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext()
	}, [emblaApi])

	const onSelect = useCallback(
		(emblaApi: {
			canScrollPrev: () => unknown
			canScrollNext: () => unknown
		}) => {
			setPrevBtnDisabled(!emblaApi.canScrollPrev())
			setNextBtnDisabled(!emblaApi.canScrollNext())
		},
		[]
	)

	useEffect(() => {
		if (!emblaApi) return

		onSelect(emblaApi)
		emblaApi.on("reInit", onSelect)
		emblaApi.on("select", onSelect)
	}, [emblaApi, onSelect])

	if (loading) {
		return (
			<div className='relative px-4 sm:px-8 md:px-12'>
				<div className='overflow-hidden'>
					<div className='flex gap-2 sm:gap-3 md:gap-4'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className='flex-[0_0_calc(90vw-2rem)] sm:flex-[0_0_calc(45vw-1rem)] md:flex-[0_0_calc(33vw-1rem)] lg:flex-[0_0_280px] min-w-0'
							>
								<div className='relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-48 sm:h-56 md:h-64'>
									{/* Image skeleton */}
									<Skeleton className='w-full h-full bg-gray-800/50' />

									{/* Title overlay skeleton */}
									<div className='absolute bottom-4 left-4 right-4'>
										<Skeleton className='h-4 sm:h-5 md:h-6 w-3/4 bg-gray-700/50' />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	if (games.length === 0) {
		return (
			<div className='relative px-4 sm:px-8 md:px-12'>
				<div className='flex gap-4 justify-center items-center py-20'>
					<span className='text-gray-400 text-sm sm:text-base'>
						No games available
					</span>
				</div>
			</div>
		)
	}

	return (
		<div className='relative px-4 sm:px-8 md:px-12'>
			{/* Carousel Container */}
			<div className='overflow-hidden' ref={emblaRef}>
				<div className='flex gap-2 sm:gap-3 md:gap-4'>
					{games.map((game) => (
						<GameCard
							key={game.id}
							id={game.id}
							name={game.name}
							serverCount={game.serverCount!}
							gameid={game.gameid}
							imageUrl={game.image as string}
						/>
					))}
				</div>
			</div>

			{/* Navigation Buttons - Hidden on mobile, visible on larger screens */}
			<Button
				variant='outline'
				size='icon'
				className='absolute left-2 sm:left-4 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 bg-gray-900/90 border-gray-700 hover:bg-gray-800 text-white z-10 hidden sm:flex'
				onClick={scrollPrev}
				disabled={prevBtnDisabled}
			>
				<ChevronLeft className='h-4 w-4' />
			</Button>

			<Button
				variant='outline'
				size='icon'
				className='absolute right-2 sm:right-4 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 bg-gray-900/90 border-gray-700 hover:bg-gray-800 text-white z-10 hidden sm:flex'
				onClick={scrollNext}
				disabled={nextBtnDisabled}
			>
				<ChevronRight className='h-4 w-4' />
			</Button>

			{/* Mobile Navigation Indicators */}
			<div className='flex justify-center mt-4 gap-2 sm:hidden'>
				{games.map((_, index) => (
					<button
						key={index}
						className='w-2 h-2 rounded-full bg-gray-600 hover:bg-gray-400 transition-colors'
						onClick={() => emblaApi?.scrollTo(index)}
					/>
				))}
			</div>
		</div>
	)
}
