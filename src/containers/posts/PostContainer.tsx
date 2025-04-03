import FeedPost from "@/components/contentDisplay/feedPost/FeedPost";
import type { AppBskyFeedDefs } from "@atproto/api";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { memo } from "react";
import type { ContentFilterResult } from "../../types/feed";

interface Props {
	post: AppBskyFeedDefs.FeedViewPost;
	isReply?: boolean;
	filter: ContentFilterResult;
}

const PostContainer = memo(function PostContainer(props: Props) {
	const { post, isReply, filter } = props;
	const parent = {
		post: post?.reply?.parent as PostView,
	};

	return (
		<div className="border-skin-base flex flex-col justify-between border border-x-0 first:border-t-0 last:border-b md:border-x odd:[&:not(:last-child)]:border-b-0 even:[&:not(:last-child)]:border-b-0">
			{parent?.post && !post.reason && <FeedPost post={parent} isReply={false} isParent={true} filter={filter} />}
			{<FeedPost post={post} isReply={isReply} isParent={false} filter={filter} />}
		</div>
	);
});

export default PostContainer;
