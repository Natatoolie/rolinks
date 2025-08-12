import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
			},
		],
	},
}

export default withPayload(nextConfig)
