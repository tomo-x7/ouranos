import ThreadPreferencesContainer from "@/containers/settings/threadPreferencesContainer/ThreadPreferencesContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Thread Preferences",
	description: "Thread Preferences",
};

export default function Page() {
	return <ThreadPreferencesContainer />;
}
