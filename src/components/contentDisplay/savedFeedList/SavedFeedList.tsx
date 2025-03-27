import { getSavedFeeds } from "@/lib/api/bsky/feed";
import SavedFeedItem from "../savedFeedItem/SavedFeedItem";

export default async function SavedFeedList() {
	const savedFeeds = await getSavedFeeds();

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
