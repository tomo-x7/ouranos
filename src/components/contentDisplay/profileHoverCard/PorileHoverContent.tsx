import Avatar from "@/components/dataDisplay/avatar/Avatar";
import KnownFollowers from "@/components/dataDisplay/knownFollowers/KnownFollowers";
import ProfileBio from "@/components/dataDisplay/profileBio/ProfileBio";
import UserStats from "@/components/dataDisplay/userStats/UserStats";
import ViewerInfo from "@/components/dataDisplay/viewerInfo/ViewerInfo";
import { useSession } from "@/lib/auth";
import useProfile from "@/lib/hooks/bsky/actor/useProfile";
import useKnownFollowers from "@/lib/hooks/bsky/social/useKnownFollowers";
import { isInvalidHandle } from "@/lib/utils/text";
import { Link } from "react-router-dom";
import ProfileHoverCardSkeleton from "./ProfileHoverCardSkeleton";

interface Props {
	handle: string;
}

export default function ProfileHoverContent(props: Props) {
	const { handle } = props;
	const { data: profile, isLoading, error } = useProfile(handle);
	const { session } = useSession();

	const {
		knownFollowers,
		isKnownFollowersEmpty,
		knownFollowersError,
		isLoadingKnownFollowers,
		isFetchingKnownFollowers,
	} = useKnownFollowers({ handle });

	if (error) {
		return <span>Could not get this profile</span>;
	}

	if (isLoading || !profile) return <ProfileHoverCardSkeleton />;

	const isBlocked = !!profile?.viewer?.blocking;

	return (
		<article className="flex flex-col gap-2 grow">
			<div className="flex flex-wrap justify-between gap-3">
				<div className="flex flex-wrap items-start gap-2">
					<Link to={`/dashboard/user/${profile.handle}`} className="hover:brightness-90">
						<Avatar src={profile.avatar?.replace("avatar", "avatar_thumbnail")} size="md" />
					</Link>
					<div className="flex flex-col">
						<div className="flex flex-wrap gap-x-1.5">
							<Link
								to={`/dashboard/user/${profile.handle}`}
								className="text-skin-base font-semibold hover:text-skin-secondary"
							>
								{profile.displayName || profile.handle}
							</Link>
							{profile.viewer?.followedBy && <ViewerInfo text="Follows you" />}
							{profile.viewer?.muted || (profile.viewer?.mutedByList && <ViewerInfo text="Muted user" />)}
						</div>

						{isInvalidHandle(profile?.handle) ? (
							<ViewerInfo text="Invalid Handle" />
						) : (
							<Link
								to={`/dashboard/user/${profile.handle}`}
								className="text-skin-tertiary break-all font-medium"
							>
								@{profile?.handle}
							</Link>
						)}
					</div>
				</div>
			</div>
			{profile?.handle && (
				<UserStats
					handle={profile?.handle}
					followerCount={profile?.followersCount ?? 0}
					followCount={profile?.followsCount ?? 0}
					postsCount={profile.postsCount ?? 0}
				/>
			)}
			{profile?.description && <ProfileBio description={profile.description} truncate={true} />}

			{!isBlocked && profile?.handle && profile.viewer?.knownFollowers && profile.handle !== session?.handle && (
				<div className="mt-2 inline-block">
					<KnownFollowers handle={profile.handle} />
				</div>
			)}
		</article>
	);
}
