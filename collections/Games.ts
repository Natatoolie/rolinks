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
		},

		{
			name: "image", // required
			type: "upload", // required
			relationTo: "media", //required eg:media
			label: "Icon",
			required: true,
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
