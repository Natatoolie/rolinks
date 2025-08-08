"use client"
import { motion } from "framer-motion"
import { Twitter, MessageCircle, Youtube } from "lucide-react"
import React from "react"

const SocialSection = () => {
	return (
		<section className='mb-20'>
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "0px 0px -200px 0px" }}
				transition={{ duration: 0.6 }}
				className='text-2xl font-semibold text-white text-center mb-12 tracking-tight'
			>
				Join Our Community
			</motion.h2>

			<div className='flex justify-center items-center gap-8'>
				{[
					{
						icon: Twitter,
						name: "Twitter",
						color: "text-blue-400",
						hoverColor: "hover:text-blue-300",
						bgColor: "bg-blue-400/10",
						hoverBgColor: "hover:bg-blue-400/20",
						borderColor: "border-blue-400/30",
						hoverBorderColor: "hover:border-blue-400/60",
						url: "https://twitter.com/rolinks",
						delay: 0,
					},
					{
						icon: MessageCircle,
						name: "Discord",
						color: "text-purple-400",
						hoverColor: "hover:text-purple-300",
						bgColor: "bg-purple-400/10",
						hoverBgColor: "hover:bg-purple-400/20",
						borderColor: "border-purple-400/30",
						hoverBorderColor: "hover:border-purple-400/60",
						url: "https://discord.gg/rolinks",
						delay: 0.1,
					},
					{
						icon: Youtube,
						name: "YouTube",
						color: "text-red-400",
						hoverColor: "hover:text-red-300",
						bgColor: "bg-red-400/10",
						hoverBgColor: "hover:bg-red-400/20",
						borderColor: "border-red-400/30",
						hoverBorderColor: "hover:border-red-400/60",
						url: "https://youtube.com/@rolinks",
						delay: 0.2,
					},
				].map((social, index) => {
					const IconComponent = social.icon
					return (
						<motion.div
							key={social.name}
							initial={{ opacity: 0, y: 30, scale: 0.8 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true, margin: "0px 0px -200px 0px" }}
							transition={{
								duration: 0.6,
								delay: social.delay,
								type: "spring",
								stiffness: 100,
							}}
							whileHover={{
								scale: 1.05,
								transition: { duration: 0.2 },
							}}
							whileTap={{ scale: 0.95 }}
						>
							<motion.a
								href={social.url}
								target='_blank'
								rel='noopener noreferrer'
								className={`
											flex flex-col items-center justify-center p-8 rounded-2xl border backdrop-blur-sm
											transition-all duration-300 cursor-pointer group min-w-[140px]
											${social.bgColor} ${social.hoverBgColor}
											${social.borderColor} ${social.hoverBorderColor}
										`}
								whileHover={{
									boxShadow: `0 20px 40px -12px ${social.color.replace("text-", "").replace("-400", "")}40`,
								}}
							>
								<motion.div
									whileHover={{
										rotate: [0, -10, 10, -10, 0],
										transition: { duration: 0.5 },
									}}
								>
									<IconComponent
										className={`h-8 w-8 mb-3 ${social.color} ${social.hoverColor} transition-colors`}
									/>
								</motion.div>
								<span
									className={`font-medium ${social.color} ${social.hoverColor} transition-colors`}
								>
									{social.name}
								</span>
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									whileHover={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2 }}
									className='text-xs text-gray-500 mt-1'
								>
									Follow us
								</motion.div>
							</motion.a>
						</motion.div>
					)
				})}
			</div>

			<motion.p
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true, margin: "0px 0px -200px 0px" }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className='text-center text-gray-400 mt-8 max-w-md mx-auto'
			>
				Stay updated with the latest features, server listings, and community
				events
			</motion.p>
		</section>
	)
}

export default SocialSection
