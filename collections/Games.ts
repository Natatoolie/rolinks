import { getImageURLFromPlaceID } from "@/utils/imageUtils"
import { getPreviouslyCachedImageOrNull } from "next/dist/server/image-optimizer"
import type { CollectionConfig } from "payload"

export const Games: CollectionConfig = {
	slug: "games",
	access: {
		read: () => true,
	},
	admin: {
		useAsTitle: "name",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: "Name",
		},
		{
			name: "gameid",
			type: "number",
			required: true,
			unique: true,
			label: "Game ID",
			admin: {
				description: 'Game ID (e.g. "17371261")',
			},
			hooks: {
				beforeChange: [
					async ({ siblingData, req, context }) => {
						if (context.triggerHook === false) {
							return
						}
						console.log("ran!")
						// console.log(siblingData)
						const imageUrl = await getImageURLFromPlaceID(siblingData.gameid)

						siblingData.image = imageUrl
						await req.payload.update({
							collection: "games",
							id: siblingData.id,
							data: { image: imageUrl || null },
							where: { gameid: siblingData.gameid },
							context: {
								triggerHook: false,
							},
						})

						console.log(getPreviouslyCachedImageOrNull)
					},
				],
			},
		},

		{
			name: "image", // required
			type: "text", // required
			label: "Icon",
			access: {
				create: () => false,
				update: () => false,
			},
		},

		{
			name: "robux", // required
			label: "Robux Cost",
			type: "number", // required
			required: true,
			admin: {
				step: 1,
			},
		},

		{
			name: "serverCount",
			type: "number",
			label: "Server Count",
			defaultValue: 0,
			access: {
				create: () => false,
				update: () => false,
			},
			admin: {
				description: "Number of private servers available",
			},
		},

		{
			name: "isActive",
			type: "checkbox",
			label: "Active",
			defaultValue: true,
			admin: {
				description: "Show this game on the website",
			},
		},
	],
	timestamps: true,
}
