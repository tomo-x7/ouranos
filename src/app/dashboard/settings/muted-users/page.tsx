import MutedUsersContainer from "@/containers/settings/mutedUsersContainer/MutedUsersContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Muted Users",
	description: "Muted Users",
};

export default function Page() {
	return <MutedUsersContainer />;
}
