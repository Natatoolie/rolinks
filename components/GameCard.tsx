import React from "react"
import Image from "next/image"
import Link from "next/link"

type Props = {
	id: string
	name: string
	serverCount?: number
	gameid: number
	imageUrl?: string
}

const GameCard = ({ id, name, gameid, imageUrl }: Props) => {
	return (
		<div
			key={id}
			className='flex-[0_0_calc(90vw-2rem)] sm:flex-[0_0_calc(45vw-1rem)] md:flex-[0_0_calc(33vw-1rem)] lg:flex-[0_0_280px] min-w-0'
		>
			<Link href={`/games/${gameid}`}>
				<div className='relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group h-48 sm:h-56 md:h-64'>
					{/* Game Image */}
					<div className='relative w-full h-full'>
						{imageUrl ? (
							<Image src={imageUrl} alt={name} fill className='object-cover' />
						) : (
							<div className='w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 text-xs sm:text-sm'>
								No Image
							</div>
						)}

						{/* Title Overlay */}
						<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent'>
							<div className='absolute bottom-0 left-0 right-0 p-3 sm:p-4'>
								<h3 className='text-white font-semibold text-sm sm:text-base md:text-lg leading-tight line-clamp-2'>
									{name}
								</h3>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	)
}
export default GameCard
