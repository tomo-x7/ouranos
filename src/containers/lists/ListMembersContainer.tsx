import { useAgent } from "@/lib/providers/agent";
import ProfileCard from "@/components/contentDisplay/profileCard/ProfileCard";
import ProfileCardSkeleton from "@/components/contentDisplay/profileCard/ProfileCardSkeleton";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";
import LoadingSpinner from "@/components/status/LoadingSpinner";
import { getListMembers } from "@/lib/api/bsky/list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
	list: string;
}

export default function ListMembersContainer(props: Props) {
	const { list } = props;
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
		queryKey: ["list members", list],
		queryFn: async ({ pageParam }) => {
			return getListMembers(agent, list, pageParam);
		},
		initialPageParam: "",
		getNextPageParam: (lastPage) => lastPage.cursor,
	});

	const dataLength = profiles?.pages.reduce((acc, page) => acc + (page?.items.length ?? 0), 0);

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
					.flatMap((page) => page?.items)
					.map((item, i) => (
						<Fragment key={i}>
							{item && <ProfileCard key={item.subject.did + i} profile={item.subject} rounded={false} />}
						</Fragment>
					))}
			</InfiniteScroll>

			{isFetching && !isFetchingNextPage && <ProfileCardSkeleton rounded={false} />}
			{isEmpty && (
				<div className="border-skin-base border-t">
					<FeedAlert variant="empty" message="No members found" />
				</div>
			)}
			{error && (
				<div className="border-skin-base border-t">
					<FeedAlert variant="badResponse" message="Something went wrong" />
				</div>
			)}
		</section>
	);
}
