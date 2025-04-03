import { useAgent } from "@/lib/providers/agent";
import { useQuery } from "@tanstack/react-query";
import { getFeedInfo, getSavedFeeds } from "../../../api/bsky/feed";

export const feedInfoKey = (feed: string) => ["feedInfo", feed];

export default function useFeedInfo(feed: string) {
	const agent = useAgent();
	const { data, isLoading, isFetching, isRefetching, error } = useQuery({
		queryKey: feedInfoKey(feed),
		queryFn: async () => {
			const feedInfo = await getFeedInfo(feed, agent);
			const savedFeeds = await getSavedFeeds(agent);
			const isSaved = savedFeeds.some((savedFeed) => savedFeed.uri === feed);
			const isPinned = savedFeeds.some((savedFeed) => savedFeed.uri === feed && savedFeed.pinned);
			const isLiked = feedInfo.view.viewer?.like !== null;
			return { ...feedInfo, isSaved, isPinned, isLiked };
		},
	});

	return {
		feedInfo: data,
		isLoadingFeedInfo: isLoading,
		isFetchingFeedInfo: isFetching,
		isRefetchingFeedInfo: isRefetching,
		feedInfoError: error,
	};
}
