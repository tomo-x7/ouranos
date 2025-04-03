import TabItem from "@/components/navigational/tabs/TabItem";
import Tabs from "@/components/navigational/tabs/Tabs";
import FeedSearchContainer from "@/containers/search/FeedSearchContainer";
import PostSearchContainer from "@/containers/search/PostSearchContainer";
import UserSearchContainer from "@/containers/search/UserSearchContainer";
import { useSession } from "@/lib/auth";
import { useState } from "react";

interface Props {
	query: string;
}

export default function SearchList(props: Props) {
	const { query } = props;
	const [currentTab, setCurrentTab] = useState<"top" | "latest" | "users" | "feeds">("top");
	const { session } = useSession();

	const handleTabChange = (tab: "top" | "latest" | "users" | "feeds") => {
		setCurrentTab(tab);
	};

	const onSearchPost = (query: string) => {
		if (query.trim() === "from:me" && session?.handle) {
			return `from:${session.handle}`;
		}

		return query;
	};

	return (
		<section>
			<Tabs>
				<TabItem asButton onClick={() => handleTabChange("top")} label="Top" isActive={currentTab === "top"} />
				<TabItem
					asButton
					onClick={() => handleTabChange("latest")}
					label="Latest"
					isActive={currentTab === "latest"}
				/>
				<TabItem
					asButton
					onClick={() => handleTabChange("users")}
					label="Users"
					isActive={currentTab === "users"}
				/>
				<TabItem
					asButton
					onClick={() => handleTabChange("feeds")}
					label="Feeds"
					isActive={currentTab === "feeds"}
				/>
			</Tabs>

			{currentTab === "latest" && <PostSearchContainer query={onSearchPost(query)} sort={currentTab} />}
			{currentTab === "top" && <PostSearchContainer query={onSearchPost(query)} sort={currentTab} />}
			{currentTab === "users" && <UserSearchContainer query={query} />}
			{currentTab === "feeds" && <FeedSearchContainer query={query} />}
		</section>
	);
}
