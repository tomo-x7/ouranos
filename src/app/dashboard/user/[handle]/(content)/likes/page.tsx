import UserPostsConatiner from "@/containers/posts/UserPostsContainer";
import { getSession } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface Props {
	params: {
		handle: string;
	};
}

export default async function Page(props: Props) {
	const { handle } = props.params;
	const session = getSession();
	const nav = useNavigate();

	if (session.session?.handle !== handle) {
		nav(`/dashboard/user/${handle}`, { replace: true });
	}

	return <UserPostsConatiner mode="likes" handle={handle} />;
}
