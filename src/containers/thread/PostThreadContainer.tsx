import { useAgent } from "@/app/providers/agent";
import Button from "@/components/actions/button/Button";
import FeedPostSkeleton from "@/components/contentDisplay/feedPost/FeedPostSkeleton";
import ThreadPost from "@/components/contentDisplay/threadPost/ThreadPost";
import BlockedEmbed from "@/components/dataDisplay/postEmbed/BlockedEmbed";
import NotFoundEmbed from "@/components/dataDisplay/postEmbed/NotFoundEmbed";
import WhoCanReply from "@/components/feedback/WhoCanReply/WhoCanReply";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";
import { getPostThread } from "@/lib/api/bsky/feed";
import { useSession } from "@/lib/auth";
import { MAX_REPLY_CONTAINERS } from "@/lib/consts/thread";
import usePreferences from "@/lib/hooks/bsky/actor/usePreferences";
import useProfile from "@/lib/hooks/bsky/actor/useProfile";
import useOrganizeThread from "@/lib/hooks/bsky/feed/useOrganizeThread";
import { sortThread } from "@/lib/utils/feed";
import { replyIncludes } from "@/lib/utils/text";
import { AppBskyFeedDefs } from "@atproto/api";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ParentContainer from "./ParentContainer";
import RepliesContainer from "./RepliesContainer";
import ThreadActionsContainer from "./ThreadActionsContainer";

interface Props {
	id: string;
	handle: string;
}

export default function PostThreadContainer(props: Props) {
	const { id, handle } = props;
	const agent = useAgent();
	const searchParams = useSearchParams()[0];
	const search = searchParams.get("query") ?? "";
	const [maxReplies, setMaxReplies] = useState(MAX_REPLY_CONTAINERS);
	const nav = useNavigate();
	const { session } = useSession();
	const { data: profile } = useProfile(session?.handle!);

	const {
		data: thread,
		error,
		isError,
		isFetching,
		isLoading,
	} = useQuery({
		queryKey: ["postThread", id],
		queryFn: async () => {
			const uri = `at://${handle}/app.bsky.feed.post/${id}`;
			return getPostThread(uri, agent);
		},
	});

	const { replyChains, parentChain } = useOrganizeThread({
		thread: thread,
	});

	const [textSearch, setTextSearch] = useState(search);
	const [filteredReplies, setFilteredReplies] = useState(0);

	// Update textFilter and filteredReplies
	useEffect(() => {
		setTextSearch(search);
	}, [search]);

	useEffect(() => {
		setFilteredReplies(
			replyChains
				.map((replyArr) => replyArr.some((reply) => replyIncludes(reply.post.record, textSearch)))
				.filter(Boolean).length,
		);
	}, [replyChains, textSearch]);

	const { preferences } = usePreferences();
	const contentFilter = preferences?.contentFilter;
	const threadPreferences = preferences?.threadPreferences;

	const hasValidThread =
		!AppBskyFeedDefs.isBlockedPost(thread) &&
		!AppBskyFeedDefs.isNotFoundPost(thread) &&
		!AppBskyFeedDefs.isBlockedAuthor(thread) &&
		!isError;

	if (!hasValidThread) {
		return (
			<section className="border-skin-base border border-t-0 p-3 md:rounded-b-2xl">
				{AppBskyFeedDefs.isBlockedPost(thread) && <BlockedEmbed depth={0} />}
				{AppBskyFeedDefs.isNotFoundPost(thread) && <NotFoundEmbed depth={0} />}
				{AppBskyFeedDefs.isBlockedAuthor(thread) && <BlockedEmbed depth={0} />}
				{isError && <FeedAlert variant="badResponse" message={error.message} standalone={true} />}
				<div className="mt-3 flex justify-center">
					<Button onClick={() => nav("/dashboard/home")}>Go Home</Button>
				</div>
			</section>
		);
	}

	return (
		<div>
			{(isFetching || isLoading) && <FeedPostSkeleton />}
			{parentChain && parentChain.length > 0 && contentFilter && (
				<ParentContainer parentChain={parentChain} contentFilter={contentFilter} />
			)}

			{thread && contentFilter && (
				<div>
					<div
						className={`border-skin-base ${
							parentChain.length > 0 && "border-t"
						} p-3 last:border-b md:border-x md:last:rounded-b-2xl`}
					>
						<ThreadPost post={thread?.post as PostView} filter={contentFilter} />
					</div>
					<WhoCanReply post={thread?.post as PostView} />
					{profile && (
						<ThreadActionsContainer
							avatar={profile?.avatar}
							post={thread?.post as PostView}
							rounded={textSearch === "" && filteredReplies === 0}
						/>
					)}

					{textSearch !== "" && filteredReplies === 0 && (
						<div className="border-skin-base border-t">
							<FeedAlert variant="empty" message={`No replies found that match "${textSearch}"`} />
						</div>
					)}
				</div>
			)}
			{contentFilter &&
				threadPreferences &&
				replyChains &&
				replyChains
					.sort((a, b) => sortThread(a[0], b[0], threadPreferences))
					.map((replyArr, i) => {
						const showReplies = textSearch === "" ? i <= maxReplies : true;

						return (
							// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
							<>
								{showReplies &&
									replyArr.some((reply) => replyIncludes(reply.post.record, textSearch)) && (
										<div
											className="border-skin-base border border-x-0 first:border-t-0 last:border-b md:border-x md:last:rounded-b-2xl odd:[&:not(:last-child)]:border-b-0 even:[&:not(:last-child)]:border-b-0"
											key={i}
										>
											<RepliesContainer replies={replyArr} contentFilter={contentFilter} />
										</div>
									)}
							</>
						);
					})}

			{replyChains && replyChains.length > maxReplies && textSearch === "" && (
				<div className="border-skin-base border border-x-0 p-3 first:border-t-0 last:border-b md:border-x md:last:rounded-b-2xl odd:[&:not(:last-child)]:border-b-0 even:[&:not(:last-child)]:border-b-0">
					<button
						type="button"
						onClick={() => setMaxReplies((prevMax) => prevMax + MAX_REPLY_CONTAINERS)}
						className="text-skin-secondary bg-skin-muted hover:bg-skin-muted/90 mx-auto block rounded-full px-2.5 py-2 text-sm font-medium"
					>
						Show More Replies
					</button>
				</div>
			)}
		</div>
	);
}
