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
		{
			name: "servers", // required
			type: "array", // required
			label: "Private Servers",
			minRows: 0,
			maxRows: 30,
			labels: {
				singular: "server",
				plural: "servers",
			},
			fields: [
				// required
				{
					name: "link", // required
					type: "text", // required
					label: "Server Link",
					required: true,
				},
				{
					name: "createdAt", // required
					type: "date", // required
					label: "Created At",
					defaultValue: new Date().toISOString(),
					access: {
						create: () => false,
						update: () => false,
					},
				},
				{
					name: "checkedAt", // required
					type: "date", // required
					label: "Last Checked",
					defaultValue: new Date().toISOString(),

					access: {
						create: () => false,
						update: () => false,
					},
				},
			],
		},
	],
	timestamps: true,
}
