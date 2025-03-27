import BlockedUsersContainer from "@/containers/settings/blockedUsersContainer/BlockedUsersContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blocked Users",
	description: "Blocked Users",
};

export default function Page() {
	return <BlockedUsersContainer />;
}
