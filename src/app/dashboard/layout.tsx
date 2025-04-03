import Composer from "@/components/actions/composer/Composer";
import AppBar from "@/components/navigational/appBar/AppBar";
import Aside from "@/components/navigational/aside/Aside";
import SidePanel from "@/components/navigational/sidePanel/SidePanel";
import TopBar from "@/components/navigational/topBar/TopBar";
import { getProfile } from "@/lib/api/bsky/actor";
import { createAgent } from "@/lib/api/bsky/agent";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { AgentProvider } from "../providers/agent";

export const metadata: Metadata = {
	title: { template: "%s — Ouranos", default: "Ouranos" },
	description: "Home",
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = getSession();
	const agent = createAgent(session.serviceURL ?? "https://bsky.social");
	agent.sessionManager.session = session.session;
	const profile = await getProfile(session.session?.handle, agent);

	return (
		<AgentProvider session={session}>
			<main className="bg-skin-base flex justify-center gap-6 pb-20 md:mt-6 lg:gap-16 animate-fade">
				{profile && <Composer author={profile} />}
				<SidePanel />
				<section className="w-full md:max-w-xl">
					{profile && <TopBar profile={profile} />}
					{children}
				</section>
				{profile && <Aside avatar={profile?.avatar} handle={profile?.handle} />}
				<AppBar />
			</main>
		</AgentProvider>
	);
}
