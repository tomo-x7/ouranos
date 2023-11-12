import { AppBskyFeedDefs } from "@atproto/api";
import useAgent from "./useAgent";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { likePost, unlikePost } from "../api/bsky/feed";

interface Props {
  post: AppBskyFeedDefs.PostView;
}

export default function useLike(props: Props) {
  const { post } = props;
  const agent = useAgent();
  const [liked, setLiked] = useState(!!post.viewer?.like);
  const [likeUri, setLikeUri] = useState(post.viewer?.like);

  const handleToggleLike = useMutation({
    mutationKey: ["like", post.uri],
    mutationFn: async () => {
      if (!likeUri) {
        try {
          setLiked(true);
          const like = await likePost(agent, post.uri, post.cid);
          setLikeUri(like.uri);
        } catch (err) {
          setLiked(false);
        }
      } else {
        try {
          setLiked(false);
          await unlikePost(agent, likeUri);
          setLikeUri(undefined);
        } catch (err) {
          setLiked(true);
        }
      }
    },
  });

  return {
    liked,
    handleToggleLike,
    likeCount:
      (liked ? 1 : 0) - (post.viewer?.like ? 1 : 0) + (post.likeCount || 0),
  };
}
