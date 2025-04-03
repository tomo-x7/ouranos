import { useAgent } from "@/lib/providers/agent";
import type { AppBskyFeedDefs } from "@atproto/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removePost } from "../../../api/bsky/feed";

interface Props {
	post: AppBskyFeedDefs.PostView;
}

export const useDeletePostKey = (postUri: string) => ["deletePost", postUri];

export default function useDeletePost(props: Props) {
	const { post } = props;
	const agent = useAgent();
	const queryClient = useQueryClient();

	const deletePost = useMutation({
		mutationKey: useDeletePostKey(post.uri),
		mutationFn: async () => {
			try {
				await removePost(agent, post.uri);
			} catch (err) {
				console.error(err);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["timeline"] });
			queryClient.invalidateQueries({ queryKey: ["profilePosts"] });
			queryClient.invalidateQueries({ queryKey: ["postThread"] });
			toast.success("Post deleted", { id: "Post deleted" });
		},
		onError: () => {
			toast.error("Could not delete post", { id: "Post deletion error" });
		},
	});

	return {
		deletePost,
	};
}
