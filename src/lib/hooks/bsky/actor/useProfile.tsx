import { useAgent } from "@/app/providers/agent";
import { getProfile } from "@/lib/api/bsky/actor";
import { follow, unfollow } from "@/lib/api/bsky/social";
import type { AppBskyActorDefs } from "@atproto/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const profileKey = (handle: string) => ["profile", handle];

export default function useProfile(handle: string) {
	const agent = useAgent();
	const queryClient = useQueryClient();
	const { data, isLoading, isFetching, isRefetching, error } = useQuery({
		queryKey: profileKey(handle),
		queryFn: async (): Promise<AppBskyActorDefs.ProfileViewDetailed | undefined> => {
			const profile = await getProfile(handle, agent);
			if (profile) {
				return profile;
			}
		},
	});

	const updateFollowCount = (mode: "decrease" | "increase") => {
		queryClient.setQueryData(profileKey(handle), (oldData: any) => {
			return {
				...oldData,
				viewer: {
					...oldData.viewer,
					following: mode === "increase",
				},
				followersCount: mode === "increase" ? oldData.followersCount + 1 : oldData.followersCount - 1,
			};
		});
	};

	// TODO: resolve race condition issue where unfollow stops working after unfollowing, following, and then unfollowing again
	const toggleFollow = useMutation({
		mutationKey: profileKey(handle),
		mutationFn: async () => {
			if (!data) return;

			const isCurrentlyFollowing = !!data.viewer?.following;
			// optimistically update to the new state
			updateFollowCount(isCurrentlyFollowing ? "decrease" : "increase");

			try {
				if (isCurrentlyFollowing && data.viewer?.following) {
					await unfollow(agent, data.viewer.following);
				} else {
					await follow(agent, data.did);
				}
			} catch (error) {
				// revert to the old state in case of an error
				updateFollowCount(isCurrentlyFollowing ? "increase" : "decrease");
			}
		},
	});

	return {
		data,
		isLoading,
		isFetching,
		isRefetching,
		error,
		toggleFollow,
	};
}
