import { useAgent } from "@/app/providers/agent";
import { getSuggestions } from "@/lib/api/bsky/actor";
import ProfileCard from "../profileCard/ProfileCard";

export default async function WhoToFollowList() {
	const agent = useAgent();
	const suggestions = await getSuggestions(agent);

	return (
		<section className="flex flex-col">
			{suggestions?.map((profile) => (
				<ProfileCard key={profile.did} profile={profile} />
			))}
		</section>
	);
}
