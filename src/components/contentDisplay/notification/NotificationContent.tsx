import { useAgent } from "@/app/providers/agent";
import PostEmbed from "@/components/dataDisplay/postEmbed/PostEmbed";
import PostHider from "@/components/dataDisplay/postHider/PostHider";
import PostText from "@/components/dataDisplay/postText/postText";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";
import { getPost } from "@/lib/api/bsky/feed";
import { getPostId } from "@/lib/utils/link";
import type { AppBskyFeedDefs } from "@atproto/api";
import type { ViewRecord } from "@atproto/api/dist/client/types/app/bsky/embed/record";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ContentFilterResult } from "../../../../types/feed";
import NotificationContentSkeleton from "./NotificationContentSkeleton";

interface Props {
	uri: string;
	filter: ContentFilterResult;
}

export default function NotificationContnet(props: Props) {
	const { uri, filter } = props;
	const agent = useAgent();
	const router = useRouter();

	const { status, data, error, isLoading, isFetching } = useQuery({
		queryKey: ["notificationContent", uri],
		queryFn: async () => {
			return getPost(agent, uri);
		},
	});

	const post = data?.data.thread && (data.data.thread as AppBskyFeedDefs.FeedViewPost);

	const { isAdultContentHidden, adultContentFilters } = filter;
	const label = post?.post.labels?.map((l) => l.val)[0] ?? ""; // ex. "nsfw", "suggestive"
	const embedLabel = post?.post.embed?.record
		? ((post.post.embed.record as ViewRecord)?.labels?.map((l) => l.val)[0] ?? "")
		: "";
	const message = adultContentFilters.find((f) => f.values.includes(label || embedLabel))?.message ?? "Adult content";
	const visibility = adultContentFilters.find((f) => f.values.includes(label || embedLabel))?.visibility;

	const [hidden, setHidden] = useState(
		isAdultContentHidden ? true : !!(visibility === "hide" || visibility === "warn"),
	);

	useEffect(() => {
		setHidden(isAdultContentHidden ? true : !!(visibility === "hide" || visibility === "warn"));
	}, [isAdultContentHidden, visibility]);

	return (
		<>
			{visibility !== "show" && visibility !== "ignore" && (label || embedLabel) && (
				<div className="my-2">
					<PostHider
						message={message}
						hidden={hidden}
						onToggleVisibility={setHidden}
						showToggle={visibility === "warn"}
					/>
				</div>
			)}

			<div
				onClick={(e) => {
					e.stopPropagation();
					router.push(`/dashboard/user/${post?.post.author.handle}/post/${getPostId(uri)}`);
				}}
				className="text-skin-secondary cursor-pointer text-[0.93rem]"
			>
				{!hidden && (
					<>
						{post && <PostText record={post.post.record} />}
						{post?.post.embed && (
							<div className="max-w-xs">
								<PostEmbed content={post.post.embed} depth={0} />
							</div>
						)}
					</>
				)}
			</div>
			{isFetching && <NotificationContentSkeleton />}
			{error && <FeedAlert variant="badResponse" message="Something went wrong" standalone={true} />}
		</>
	);
}
