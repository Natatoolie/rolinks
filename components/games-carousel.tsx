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
			<div className='relative'>
				<div className='overflow-hidden'>
					<div className='flex gap-4'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className='flex-[0_0_280px] min-w-0 justify-center items-center'
							>
								<div className='relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-64'>
									{/* Image skeleton */}
									<Skeleton className='w-full h-full bg-gray-800/50' />

									{/* Title overlay skeleton */}
									<div className='absolute bottom-4 left-4 right-4'>
										<Skeleton className='h-6 w-3/4 bg-gray-700/50' />
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
			<div className='relative'>
				<div className='flex gap-4 justify-center items-center py-20'>
					<span className='text-gray-400'>No games available</span>
				</div>
			</div>
		)
	}

	return (
		<div className='relative'>
			{/* Carousel Container */}
			<div className='overflow-hidden' ref={emblaRef}>
				<div className='flex gap-4 justify-center items-center'>
					{games.map((game) => (
						<GameCard
							key={game.id}
							id={game.id}
							name={game.name}
							serverCount={game.serverCount!}
							gameid={game.gameid}
							icon={game.image}
						/>
					))}
				</div>
			</div>

			{/* Navigation Buttons */}
			<Button
				variant='outline'
				size='icon'
				className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-900/80 border-gray-700 hover:bg-gray-800 text-white z-10'
				onClick={scrollPrev}
				disabled={prevBtnDisabled}
			>
				<ChevronLeft className='h-4 w-4' />
			</Button>

			<Button
				variant='outline'
				size='icon'
				className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-900/80 border-gray-700 hover:bg-gray-800 text-white z-10'
				onClick={scrollNext}
				disabled={nextBtnDisabled}
			>
				<ChevronRight className='h-4 w-4' />
			</Button>
		</div>
	)
}
