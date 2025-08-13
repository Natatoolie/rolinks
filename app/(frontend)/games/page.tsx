import GamesPage from "@/components/games-page"
import { fetchGames } from "@/utils/actions/fetchGames"

export const metadata = {
	title: "Browse Games - RoLinks",
	description:
		"Browse all available games with private servers. Find your favorite games and discover new ones.",
}

export default async function Games() {
	const getGames = async () => {
		const response = await fetchGames()
		return response.docs
	}
	return <GamesPage games={await getGames()} />
}
