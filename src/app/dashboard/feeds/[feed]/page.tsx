import { useAgent } from "@/lib/providers/agent";
import FeedHeader from "@/components/contentDisplay/feedHeader/FeedHeader";
import FeedContainer from "@/containers/posts/FeedContainer";
import { getFeedInfo } from "@/lib/api/bsky/feed";
import type { Metadata } from "next";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
	const agent = useAgent();
	const feedInfo = await getFeedInfo(searchParams.uri, agent);
	const title = feedInfo.view.displayName ? feedInfo.view.displayName : "Feed";

	return {
		title: `${title} — Ouranos`,
		description: "Feed",
	};
}

interface Props {
	searchParams: {
		uri: string;
	};
}

export default function Page(props: Props) {
	const { searchParams } = props;

	return (
		<>
			<FeedHeader feed={searchParams.uri} />
			<FeedContainer feed={searchParams.uri} mode="feed" />
		</>
	);
}
