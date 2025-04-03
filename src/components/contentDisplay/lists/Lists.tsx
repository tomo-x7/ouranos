import { useAgent } from "@/lib/providers/agent";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";
import LoadingSpinner from "@/components/status/LoadingSpinner";
import { getLists } from "@/lib/api/bsky/list";
import { useSession } from "@/lib/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListItem from "../listItem/ListItem";
import ListsSkeleton from "./ListsSkeleton";

export default function Lists() {
	const { session } = useSession();
	const agent = useAgent();

	const {
		status,
		data: lists,
		error,
		isLoading,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: ["lists"],
		queryFn: async ({ pageParam }) => {
			if (!session?.did) return;
			return getLists(session.did, pageParam, agent);
		},
		initialPageParam: "",
		getNextPageParam: (lastPage) => lastPage?.cursor,
	});

	const dataLength = lists?.pages.reduce((acc, page) => acc + (page?.lists.length ?? 0), 0);

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
				{lists?.pages
					.flatMap((page) => page?.lists)
					.map((list, i) => (
						<Fragment key={i}>{list && <ListItem list={list} />}</Fragment>
					))}
			</InfiniteScroll>

			{isFetching && !isFetchingNextPage && <ListsSkeleton />}
			{isEmpty && !hasNextPage && (
				<div className="mx-3 md:mx-0">
					<FeedAlert variant="empty" message="You have no lists" standalone />
				</div>
			)}
			{error && <FeedAlert variant="badResponse" message="Something went wrong" standalone />}
		</section>
	);
}
