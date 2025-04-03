import FallbackAvatar from "@/assets/images/fallbackAvatar.png";
import FallbackBanner from "@/assets/images/fallbackBanner.png";
import Button from "@/components/actions/button/Button";
import EditProfile from "@/components/actions/editProfile/EditProfile";
import Follow from "@/components/actions/follow/Follow";
import Gallery from "@/components/dataDisplay/gallery/Gallery";
import JoinedDate from "@/components/dataDisplay/joinedDate/JoinedDate";
import KnownFollowers from "@/components/dataDisplay/knownFollowers/KnownFollowers";
import ProfileBio from "@/components/dataDisplay/profileBio/ProfileBio";
import UserActions from "@/components/dataDisplay/userActions/UserActions";
import UserStats from "@/components/dataDisplay/userStats/UserStats";
import ViewerInfo from "@/components/dataDisplay/viewerInfo/ViewerInfo";
import Alert from "@/components/feedback/alert/Alert";
import ProfileTabs from "@/components/navigational/profileTabs/ProfileTabs";
import { useSession } from "@/lib/auth";
import usePreferences from "@/lib/hooks/bsky/actor/usePreferences";
import useProfile from "@/lib/hooks/bsky/actor/useProfile";
import { isInvalidHandle } from "@/lib/utils/text";
import { useState } from "react";
import ProfileHeaderSkeleton from "./ProfileHeaderSkeleton";

interface Props {
	handle: string;
}

export default function ProfileHeader(props: Props) {
	const { handle } = props;
	const [showAvatar, setShowAvatar] = useState(false);
	const [showBanner, setShowBanner] = useState(false);
	const { session } = useSession();

	const { data: profile, isLoading, isFetching, isRefetching, toggleFollow } = useProfile(handle);
	const isBlocked = !!profile?.viewer?.blocking;
	const hasBlockedYou = !!profile?.viewer?.blockedBy;
	const isMuted = !!profile?.viewer?.muted;
	const { preferences } = usePreferences();
	const contentFilter = preferences?.contentFilter;
	const showImpersonationWarning =
		profile?.labels?.find((label) => label.val === "impersonation") &&
		contentFilter?.contentFilters.find((item) => item.type === "impersonation")?.visibility === "warn";

	return (
		<>
			{(isLoading || (isFetching && !isRefetching)) && <ProfileHeaderSkeleton />}
			{profile && contentFilter && (
				<section className="border-skin-base overflow-hidden border-0 md:border-y border-b md:rounded-t-2xl md:border-x">
					<div className="relative">
						{isBlocked || hasBlockedYou ? (
							<img
								src={profile?.banner ?? FallbackBanner}
								alt="Banner"
								width={800}
								height={192}
								fetchPriority="high"
								className="h-40 object-cover opacity-30 contrast-75 md:h-48"
							/>
						) : (
							<Button
								onClick={() => setShowBanner(true)}
								className={`${
									profile.banner ? "cursor-pointer hover:brightness-90" : "cursor-default"
								}`}
							>
								<img
									src={profile?.banner ?? FallbackBanner}
									alt="Banner"
									width={800}
									height={192}
									fetchPriority="high"
									className="h-40 object-cover md:h-48"
								/>
							</Button>
						)}

						<div className="absolute bottom-0 translate-y-1/2 transform px-3">
							{isBlocked || hasBlockedYou ? (
								<img
									src={profile?.avatar ?? FallbackAvatar}
									alt="Avatar"
									width={95}
									height={95}
									className="bg-skin-base rounded-full border-4 border-transparent object-cover opacity-30 contrast-75"
								/>
							) : (
								<Button
									className="bg-skin-base rounded-full border-4 border-transparent"
									onClick={() => setShowAvatar(true)}
								>
									<img
										src={profile?.avatar?.replace("avatar", "avatar_thumbnail") ?? FallbackAvatar}
										alt="Avatar"
										width={95}
										height={95}
										fetchPriority="high"
										className={`rounded-full object-cover ${
											profile.avatar ? "cursor-pointer hover:brightness-90" : "cursor-default"
										}`}
									/>
								</Button>
							)}
						</div>
					</div>
					{profile?.viewer && session?.handle && (
						<div className="mr-3 mt-3 flex">
							<div className="ml-auto flex gap-2">
								<UserActions
									author={profile}
									viewer={profile.viewer}
									viewerHandle={session?.handle}
									viewerDID={session?.did}
								/>
								<Follow
									onToggleFollow={toggleFollow}
									author={profile}
									viewer={profile.viewer}
									viewerDID={session?.did}
								/>
								{handle === session?.handle && <EditProfile profile={profile} />}
							</div>
						</div>
					)}
					<div className="mx-3 mb-3 mt-1">
						<div className="flex flex-wrap items-center gap-x-2">
							<h1 className="text-skin-base break-all text-2xl font-semibold">
								{profile.displayName || profile.handle}
							</h1>
							<div className="flex flex-wrap gap-1.5">
								{profile.viewer?.followedBy && <ViewerInfo text="Follows you" />}
							</div>
						</div>
						{isInvalidHandle(profile?.handle) ? (
							<ViewerInfo text="Invalid Handle" />
						) : (
							<h2 className="text-skin-tertiary break-all font-medium">@{profile?.handle}</h2>
						)}

						{profile?.description && <ProfileBio description={profile.description} />}

						{profile.createdAt && (
							<div className="my-2">
								<JoinedDate date={new Date(profile.createdAt)} />
							</div>
						)}

						{profile?.handle && (
							<div className="mt-2">
								<UserStats
									handle={profile?.handle}
									followerCount={profile?.followersCount ?? 0}
									followCount={profile?.followsCount ?? 0}
									postsCount={profile.postsCount ?? 0}
								/>
							</div>
						)}
						{!isBlocked &&
							profile?.handle &&
							profile.viewer?.knownFollowers &&
							profile.handle !== session?.handle && (
								<div className="mt-2">
									<KnownFollowers handle={profile.handle} />
								</div>
							)}
						{showImpersonationWarning && (
							<div className="mt-2">
								<Alert variant="warning" message="This account may be an impersonation" />
							</div>
						)}
						{isMuted && (
							<div className="mt-2">
								<Alert variant="warning" message="You have muted this user" />
							</div>
						)}
						{isBlocked && (
							<div className="mt-2">
								<Alert variant="error" message="You have blocked this user" />
							</div>
						)}
						{hasBlockedYou && (
							<div className="mt-2">
								<Alert variant="error" message="You have been blocked by this user" />
							</div>
						)}
					</div>

					{!hasBlockedYou && <ProfileTabs />}

					{showAvatar && profile.avatar && (
						<Gallery images={[{ src: profile.avatar }]} onClose={() => setShowAvatar(false)} />
					)}
					{showBanner && profile.banner && (
						<Gallery images={[{ src: profile.banner }]} onClose={() => setShowBanner(false)} />
					)}
				</section>
			)}
		</>
	);
}
