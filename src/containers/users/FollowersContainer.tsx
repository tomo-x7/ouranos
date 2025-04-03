import { useAgent } from "@/lib/providers/agent";
import ProfileCard from "@/components/contentDisplay/profileCard/ProfileCard";
import ProfileCardSkeleton from "@/components/contentDisplay/profileCard/ProfileCardSkeleton";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";
import LoadingSpinner from "@/components/status/LoadingSpinner";
import { getFollowers } from "@/lib/api/bsky/social";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
	handle: string;
}

export default function FollowersContainer(props: Props) {
	const { handle } = props;
	const agent = useAgent();
	const {
		status,
		data: profiles,
		error,
		isLoading,
		isFetching,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["getFollowers", handle],
		queryFn: async ({ pageParam }) => {
			return getFollowers(handle, agent, pageParam);
		},
		initialPageParam: "",
		getNextPageParam: (lastPage) => lastPage.data.cursor,
	});

	const dataLength = profiles?.pages.reduce((acc, page) => acc + (page?.data.followers.length ?? 0), 0);

	const isEmpty = !isFetching && !isFetchingNextPage && dataLength === 0;

	return (
		<section>
			<InfiniteScroll
				dataLength={dataLength ?? 0}
				next={fetchNextPage}
				hasMore={hasNextPage}
				loader={<LoadingSpinner />}
				scrollThreshold={0.8}
				className="no-scrollbar flex flex-col"
			>
				{profiles?.pages
					.flatMap((page) => page?.data.followers)
					.map((profile, i) => (
						<Fragment key={i}>
							{profile && <ProfileCard key={profile?.handle + i} profile={profile} />}
						</Fragment>
					))}
			</InfiniteScroll>

			{isFetching && !isFetchingNextPage && <ProfileCardSkeleton />}
			{isEmpty && (
				<div className="mx-3 md:mx-0">
					<FeedAlert variant="empty" message={`${handle} has no followers... yet`} standalone />
				</div>
			)}
		</section>
	);
}
