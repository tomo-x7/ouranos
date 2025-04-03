import { useAgent } from "@/lib/providers/agent";
import { getPost } from "@/lib/api/bsky/feed";
import type { AppBskyFeedDefs } from "@atproto/api";
import { useQuery } from "@tanstack/react-query";
import type { ContentFilterResult } from "../../../types/feed";
import FeedPost from "../feedPost/FeedPost";
import NotificationPostSkeleton from "./NotificationPostSkeleton";

interface Props {
	uri: string;
	filter: ContentFilterResult;
}

export default function NotificationPost(props: Props) {
	const { uri, filter } = props;
	const agent = useAgent();

	const {
		status,
		data: post,
		error,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["notificationPost", uri],
		queryFn: async () => {
			return getPost(agent, uri);
		},
	});

	return (
		<>
			{isLoading && <NotificationPostSkeleton />}
			{post?.data && <FeedPost post={post.data.thread as AppBskyFeedDefs.FeedViewPost} filter={filter} />}
		</>
	);
}
