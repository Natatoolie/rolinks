"use client"
import { motion } from "framer-motion"
import {
	Zap,
	Shield,
	Users,
	ArrowRight,
	CheckCircle,
	Sparkles,
} from "lucide-react"
import React from "react"

const FeaturesSection = () => {
	const features = [
		{
			icon: Zap,
			title: "Lightning Fast",
			description:
				"Instant server discovery with real-time player counts and status updates.",
			color: "yellow",
			gradient: "from-yellow-400 to-orange-500",
			mockImage: "speed",
			delay: 0,
		},
		{
			icon: Shield,
			title: "Verified Servers",
			description:
				"All servers are verified for quality and safety. No scams, no malicious content.",
			color: "green",
			gradient: "from-green-400 to-emerald-500",
			mockImage: "security",
			delay: 0.2,
		},
		{
			icon: Users,
			title: "Active Community",
			description:
				"Join thousands of players in our vibrant community of server enthusiasts.",
			color: "blue",
			gradient: "from-blue-400 to-purple-500",
			mockImage: "community",
			delay: 0.4,
		},
	]

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	}

	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 50,
			scale: 0.8,
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 15,
			},
		},
	}

	const MockImage = ({
		type,
		gradient,
		color,
	}: {
		type: string
		gradient: string
		color: string
	}) => {
		switch (type) {
			case "speed":
				return (
					<div className='relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
						<div
							className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20`}
						></div>

						{/* Animated speed lines */}
						{[...Array(5)].map((_, i) => (
							<motion.div
								key={i}
								className={`absolute top-1/2 h-1 bg-gradient-to-r ${gradient} rounded-full`}
								style={{ width: `${60 - i * 10}px`, top: `${40 + i * 8}%` }}
								animate={{
									x: [-100, 200],
									opacity: [0, 1, 0],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									delay: i * 0.1,
									ease: "easeInOut",
								}}
							/>
						))}

						{/* Central glow */}
						<motion.div
							className={`absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-r ${gradient} rounded-full`}
							style={{ transform: "translate(-50%, -50%)" }}
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.6, 1, 0.6],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
					</div>
				)

			case "security":
				return (
					<div className='relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
						<div
							className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20`}
						></div>

						{/* Shield outline */}
						<motion.div
							className='absolute top-1/2 left-1/2 w-16 h-20 border-2 border-green-400 rounded-t-full'
							style={{
								transform: "translate(-50%, -50%)",
								clipPath:
									"polygon(50% 0%, 0% 40%, 0% 100%, 50% 85%, 100% 100%, 100% 40%)",
							}}
							animate={{
								borderColor: ["#4ade80", "#22c55e", "#4ade80"],
								scale: [1, 1.05, 1],
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>

						{/* Checkmark */}
						<motion.div
							className='absolute top-1/2 left-1/2 text-green-400'
							style={{ transform: "translate(-50%, -50%)" }}
							initial={{ scale: 0, rotate: -180 }}
							animate={{
								scale: [0, 1.2, 1],
								rotate: [-180, 0, 0],
							}}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								repeatDelay: 2,
								ease: "easeOut",
							}}
						>
							<CheckCircle size={24} />
						</motion.div>

						{/* Ripple effect */}
						<motion.div
							className='absolute top-1/2 left-1/2 border border-green-400/30 rounded-full'
							style={{ transform: "translate(-50%, -50%)" }}
							animate={{
								scale: [0, 3],
								opacity: [0.8, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeOut",
							}}
						/>
					</div>
				)

			case "community":
				return (
					<div className='relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900'>
						<div
							className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20`}
						></div>

						{/* Animated user circles */}
						{[...Array(6)].map((_, i) => {
							const positions = [
								{ x: "30%", y: "30%" },
								{ x: "70%", y: "25%" },
								{ x: "50%", y: "45%" },
								{ x: "25%", y: "65%" },
								{ x: "75%", y: "70%" },
								{ x: "50%", y: "75%" },
							]

							return (
								<motion.div
									key={i}
									className={`absolute w-3 h-3 bg-gradient-to-r ${gradient} rounded-full`}
									style={{
										left: positions[i].x,
										top: positions[i].y,
										transform: "translate(-50%, -50%)",
									}}
									animate={{
										scale: [1, 1.3, 1],
										opacity: [0.7, 1, 0.7],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										delay: i * 0.3,
										ease: "easeInOut",
									}}
								/>
							)
						})}

						{/* Connection lines */}
						{[...Array(3)].map((_, i) => (
							<motion.div
								key={`line-${i}`}
								className={`absolute h-px bg-gradient-to-r ${gradient} opacity-50`}
								style={{
									left: "30%",
									right: "30%",
									top: `${40 + i * 15}%`,
									transform: "translateY(-50%)",
								}}
								animate={{
									scaleX: [0, 1, 0],
									opacity: [0, 0.6, 0],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									delay: i * 0.4,
									ease: "easeInOut",
								}}
							/>
						))}

						{/* Central sparkle */}
						<motion.div
							className='absolute top-1/2 left-1/2 text-blue-400'
							style={{ transform: "translate(-50%, -50%)" }}
							animate={{
								rotate: [0, 360],
								scale: [0.8, 1.2, 0.8],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<Sparkles size={16} />
						</motion.div>
					</div>
				)

			default:
				return <div className='w-full h-32 bg-gray-800 rounded-lg'></div>
		}
	}

	return (
		<section className='mb-20'>
			<motion.h2
				initial={{ opacity: 0, y: -30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
				className='text-3xl font-bold text-white text-center mb-4 tracking-tight'
			>
				Why Choose RoLinks?
			</motion.h2>

			<motion.p
				initial={{ opacity: 0, y: -20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className='text-gray-400 text-center mb-12 max-w-2xl mx-auto'
			>
				Experience the future of Roblox server discovery with our cutting-edge
				platform
			</motion.p>

			<motion.div
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, margin: "0px 0px -200px 0px" }}
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
			>
				{features.map((feature, index) => {
					const IconComponent = feature.icon
					return (
						<motion.div
							key={feature.title}
							variants={cardVariants}
							whileHover={{
								y: -8,
								transition: { duration: 0.3, type: "spring", stiffness: 400 },
							}}
							className='group relative'
						>
							{/* Card */}
							<motion.div
								className={`
									relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 
									hover:border-gray-700 transition-all duration-500 overflow-hidden h-full
									hover:shadow-2xl
								`}
								whileHover={{
									borderColor: `var(--${feature.color}-500)`,
									boxShadow: `0 25px 50px -12px var(--${feature.color}-500)20`,
								}}
							>
								{/* Background gradient on hover */}
								<motion.div
									className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
								/>

								{/* Mock Image */}
								<div className='mb-6'>
									<MockImage
										type={feature.mockImage}
										gradient={feature.gradient}
										color={feature.color}
									/>
								</div>

								{/* Icon and Title */}
								<div className='flex items-center mb-4'>
									<motion.div
										className={`p-3 rounded-xl bg-${feature.color}-400/10 mr-4 group-hover:bg-${feature.color}-400/20 transition-colors`}
										whileHover={{
											rotate: [0, -5, 5, 0],
											transition: { duration: 0.5 },
										}}
									>
										<IconComponent
											className={`h-6 w-6 text-${feature.color}-400 group-hover:text-${feature.color}-300 transition-colors`}
										/>
									</motion.div>
									<h3 className='text-white font-bold text-xl group-hover:text-white/90 transition-colors'>
										{feature.title}
									</h3>
								</div>

								{/* Description */}
								<p className='text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed mb-4'>
									{feature.description}
								</p>

								{/* Learn More Link */}
								<motion.div
									className='flex items-center text-sm text-gray-500 group-hover:text-gray-400 transition-colors cursor-pointer'
									whileHover={{ x: 5 }}
									transition={{ duration: 0.2 }}
								>
									<span>Learn more</span>
									<ArrowRight size={16} className='ml-2' />
								</motion.div>

								{/* Decorative elements */}
								<motion.div
									className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
								/>
							</motion.div>
						</motion.div>
					)
				})}
			</motion.div>
		</section>
	)
}

export default FeaturesSection
