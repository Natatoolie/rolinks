import React from "react"
import Image from "next/image"
import { Media } from "@/payload-types"

type Props = {
	id: string
	name: string
	serverCount?: number
	gameid: number
	icon: Media | string
}

const GameCard = ({ id, name, serverCount, gameid, icon }: Props) => {
	const iconUrl = typeof icon === 'string' ? icon : icon.url
	
	return (
		<div key={id} className='flex-[0_0_280px] min-w-0'>
			<div className='relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer group h-64'>
				{/* Game Image */}
				<div className='relative w-full h-full'>
					{iconUrl ? (
						<Image 
							src={iconUrl} 
							alt={name} 
							fill
							className='object-cover'
						/>
					) : (
						<div className='w-full h-full bg-gray-800 flex items-center justify-center text-gray-400'>
							No Image
						</div>
					)}
					
					{/* Title Overlay */}
					<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent'>
						<div className='absolute bottom-0 left-0 right-0 p-4'>
							<h3 className='text-white font-semibold text-lg leading-tight'>
								{name}
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default GameCard
