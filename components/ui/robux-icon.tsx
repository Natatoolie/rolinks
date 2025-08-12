import Image from "next/image"
import React from "react"

interface RobuxIconProps {
	className?: string
	size?: number
}

export const RobuxIcon: React.FC<RobuxIconProps> = ({
	className = "",
	size = 16,
}) => {
	return (
		<Image
			src='/robux.svg'
			alt='Robux'
			className={className}
			width={size}
			height={size}
			style={{ display: "inline-block" }}
		/>
	)
}
