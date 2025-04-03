import useBlockUser from "@/lib/hooks/bsky/actor/useBlockUser";
import type { AppBskyFeedDefs } from "@atproto/api";
import type { ViewerState } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import type { UseMutationResult } from "@tanstack/react-query";
import { BiPlus } from "react-icons/bi";
import { BiCheck } from "react-icons/bi";
import Button from "../button/Button";

interface Props {
	onToggleFollow: UseMutationResult<void, Error, void, unknown>;
	author: AppBskyFeedDefs.PostView["author"];
	viewer: ViewerState;
	viewerDID: string;
}

export default function Follow(props: Props) {
	const { onToggleFollow, author, viewer, viewerDID } = props;
	const isBlocked = !!(viewer.blocking || viewer.blockingByList);
	const hasBlockedYou = !!viewer.blockedBy;
	const isFollowing = !!viewer.following;

	const { blocked, toggleBlockUser } = useBlockUser({
		author: author,
		viewer: viewer,
		viewerDID: viewerDID,
	});

	if (author.did === viewerDID) return null;

	return (
		<>
			{!isBlocked && !hasBlockedYou && (
				<Button
					onClick={() => onToggleFollow.mutate()}
					className={`rounded-full px-4 py-2 text-sm font-medium ${
						isFollowing
							? "text-skin-base bg-skin-tertiary hover:brightness-95"
							: "bg-skin-inverted hover:bg-skin-inverted-muted text-skin-inverted"
					}`}
				>
					{isFollowing ? (
						<BiCheck className="text-skin-icon-base text-xl" />
					) : (
						<BiPlus className="text-skin-inverted text-lg" />
					)}
					{isFollowing ? "Following" : "Follow"}
				</Button>
			)}

			{hasBlockedYou && (
				<Button
					disabled={true}
					className={`rounded-full px-4 py-2 ${
						isFollowing
							? "bg-skin-tertiary hover:brightness-95"
							: "text-skin-inverted bg-skin-inverted hover:brightness-90"
					}`}
				>
					Blocked
				</Button>
			)}

			{isBlocked && (
				<Button
					onClick={() => {
						toggleBlockUser.mutate();
					}}
					className="bg-skin-tertiary rounded-full px-4 py-2 text-sm font-medium hover:brightness-95"
				>
					Unblock
				</Button>
			)}
		</>
	);
}
