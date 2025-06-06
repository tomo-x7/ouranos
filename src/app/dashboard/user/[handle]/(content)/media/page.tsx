import UserPostsConatiner from "@/containers/posts/UserPostsContainer";

interface Props {
	params: {
		handle: string;
	};
}

export default function Page(props: Props) {
	const { handle } = props.params;

	return <UserPostsConatiner mode="media" handle={handle} />;
}
