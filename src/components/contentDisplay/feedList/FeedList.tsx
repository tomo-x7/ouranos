import { useAgent } from "@/app/providers/agent";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";
import { getPopularFeeds, getSavedFeeds } from "@/lib/api/bsky/feed";
import FeedItem from "../feedItem/FeedItem";

interface Props {
	query: string;
}

export default async function FeedList(props: Props) {
	const { query } = props;
	const agent = useAgent();
	const savedFeeds = await getSavedFeeds(agent);
	const popularFeeds = await getPopularFeeds(agent, query);

	return (
		<section className="flex flex-col">
			{popularFeeds?.map((feed) => (
				<FeedItem
					key={feed.cid}
					feedItem={feed}
					saved={savedFeeds.some((savedFeed) => savedFeed.uri === feed.uri)}
				/>
			))}
			{popularFeeds.length === 0 && (
				<div className="border-skin-base border-t">
					<FeedAlert variant="empty" message="No feeds found" />
				</div>
			)}
		</section>
	);
}
