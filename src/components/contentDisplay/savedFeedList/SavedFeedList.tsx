import { useAgent } from "@/lib/providers/agent";
import { getSavedFeeds } from "@/lib/api/bsky/feed";
import SavedFeedItem from "../savedFeedItem/SavedFeedItem";

export default async function SavedFeedList() {
	const agent = useAgent();
	const savedFeeds = await getSavedFeeds(agent);

	return (
		<section className="flex flex-col">
			{savedFeeds
				?.sort((feed) => (feed.pinned ? -1 : 1))
				.map((feed) => (
					<SavedFeedItem key={feed.cid} feedItem={feed} />
				))}
		</section>
	);
}
