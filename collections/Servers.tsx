import { adjectives, generateName, nouns } from "@/lib/serverNames"
import { CollectionConfig } from "payload"

const Servers: CollectionConfig = {
	slug: "servers",

	labels: {
		singular: "Server",
		plural: "Servers",
	},
	admin: {
		useAsTitle: "name",
	},
	fields: [
		{
			name: "name", // required
			type: "text", // required
			label: "Server Name",
			required: true,
			defaultValue: generateName,

			access: {
				create: () => false,
				update: () => false,
			},
		},
		{
			name: "link", // required
			type: "text", // required
			label: "Server Link",
			required: true,
		},
		{
			name: "game", // required
			label: "Game",
			type: "relationship", // required
			relationTo: "games", //required eg:users
			hasMany: false,
			required: true,
		},
		{
			name: "checkedAt",
			type: "date",
			required: false,
			access: {
				create: () => false,
				update: () => false,
			},
			defaultValue: () => new Date().toISOString(),
		},
		{
			name: "creator",
			type: "relationship",
			relationTo: "users",
		},
	],

	timestamps: true,
}

export default Servers
