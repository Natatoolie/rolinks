"use client"
import { motion } from "framer-motion"
import { Twitter, MessageCircle, Youtube } from "lucide-react"
import React from "react"

const SocialSection = () => {
	const DiscordIcon = ({ className }: { className?: string }) => (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
		</svg>
	)

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

			<div className='flex justify-center items-center flex-col sm:flex-row gap-8'>
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
						icon: DiscordIcon,
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
