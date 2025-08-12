"use client"
import { motion } from "framer-motion"
import { Zap, Shield, Users, ArrowRight } from "lucide-react"
import React from "react"

const FeaturesSection = () => {
	const features = [
		{
			icon: Users,
			title: "Community Managed",
			description:
				"Servers are managed and maintained by our dedicated community of players.",
			color: "blue",
			gradient: "from-blue-400 to-purple-500",
			delay: 0,
		},
		{
			icon: Shield,
			title: "Actively Checked",
			description:
				"Regular monitoring ensures all servers are functional and up running.",
			color: "green",
			gradient: "from-green-400 to-emerald-500",
			delay: 0.2,
		},
		{
			icon: Zap,
			title: "Up to Date",
			description:
				"Server information is constantly updated with the latest status and data.",
			color: "yellow",
			gradient: "from-yellow-400 to-orange-500",
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
