import { useAgent } from "@/lib/providers/agent";
import FallbackFeed from "@/assets/images/fallbackFeed.png";
import Button from "@/components/actions/button/Button";
import { savedFeedsQueryKey } from "@/containers/settings/myFeedsContainer/MyFeedsContainer";
import { toggleSaveFeed } from "@/lib/api/bsky/feed";
import type { GeneratorView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BiPlus, BiSolidHeart, BiSolidTrash } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

interface Props {
	feedItem: GeneratorView;
	saved?: boolean;
	rounded?: boolean;
}

export default function FeedItem(props: Props) {
	const { feedItem, saved, rounded = true } = props;
	const agent = useAgent();
	const { avatar, displayName, description, likeCount, creator } = feedItem;
	const [isSaved, setIsSaved] = useState(saved);
	const nav = useNavigate();
	const queryClient = useQueryClient();

	const handleSave = async () => {
		setIsSaved((prev) => !prev);
		try {
			const response = await toggleSaveFeed(agent, feedItem.uri);
			if (!response.success) {
				setIsSaved((prev) => !prev);
			}
		} catch (error) {
			setIsSaved((prev) => !prev);
		} finally {
			nav(0);
			queryClient.invalidateQueries({ queryKey: savedFeedsQueryKey });
		}
	};

	return (
		<Link
			to={`/dashboard/feeds/${encodeURIComponent(feedItem.uri.split(":")[3].split("/")[0])}?uri=${feedItem.uri}`}
			// to={{
			// 	pathname: `/dashboard/feeds/${encodeURIComponent(feedItem.uri.split(":")[3].split("/")[0])}`,
			// 	query: { uri: feedItem.uri },
			// }}
			className={`border-skin-base hover:bg-skin-secondary flex flex-col gap-2 border border-x-0 p-3 last:border-b md:border-x ${
				rounded && "md:first:rounded-t-2xl"
			} md:last:rounded-b-2xl odd:[&:not(:last-child)]:border-b-0 even:[&:not(:last-child)]:border-b-0`}
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-3">
					<img
						src={avatar ?? FallbackFeed}
						alt={displayName}
						width={40}
						height={40}
						className={`rounded-lg ${!avatar && "border-skin-base bg-skin-muted border"}`}
					/>
					<div className="flex flex-col">
						<h2 className="text-skin-base break-words font-semibold">{feedItem.displayName}</h2>
						<h3 className="text-skin-secondary break-all text-sm">By @{creator.handle}</h3>
					</div>
				</div>
				<Button
					onClick={(e) => {
						e.preventDefault();
						handleSave();
					}}
				>
					{isSaved && <BiSolidTrash className="text-status-danger text-lg" />}
					{!isSaved && <BiPlus className="text-skin-icon-base text-lg" />}
				</Button>
			</div>
			<p className="text-skin-base break-words">{description}</p>
			<small className="text-skin-secondary flex items-center gap-1 font-medium">
				<BiSolidHeart className="text-skin-icon-base" />
				<span>{likeCount ?? 0}</span>
			</small>
		</Link>
	);
}
