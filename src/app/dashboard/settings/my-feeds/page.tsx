import MyFeedsContainer from "@/containers/settings/myFeedsContainer/MyFeedsContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Feeds",
	description: "My Feeds",
};

export default function Page() {
	return <MyFeedsContainer />;
}
