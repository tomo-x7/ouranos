import ContentFilteringContainer from "@/containers/settings/contentFilteringContainer/ContentFilteringContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Content Filtering",
	description: "Content Filtering",
};

export default function Page() {
	return <ContentFilteringContainer />;
}
