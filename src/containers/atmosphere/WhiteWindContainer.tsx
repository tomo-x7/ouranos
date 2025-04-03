import Alert from "@/components/feedback/alert/Alert";
import { getFormattedDate } from "@/lib/utils/time";
import type { Record } from "@atproto/api/dist/client/types/com/atproto/repo/listRecords";
import { Link } from "react-router-dom";
import { ComWhtwndBlogEntry } from "../../../types/atmosphere/index";

interface Props {
	records: Record[];
	handle: string;
}

export default function WhiteWindContainer(props: Props) {
	const { records, handle } = props;

	if (!records.every((item) => ComWhtwndBlogEntry.isRecord(item?.value))) {
		return <Alert variant="error" message="Invalid records" />;
	}

	return (
		<section>
			{records.map((post) => (
				// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
				<>
					{ComWhtwndBlogEntry.isRecord(post.value) && post.value.visibility === "public" && (
						<Link
							key={post.uri}
							to={`https://whtwnd.com/${handle}/entries/${encodeURIComponent(post.value.title!)}`}
							target="_blank"
							className="flex flex-col p-3 bg-skin-base border border-x-0 md:border-x first:border-t-0 md:last:rounded-b-2xl odd:[&:not(:last-child)]:border-b-0 even:[&:not(:last-child)]:border-b-0 border-skin-base hover:bg-skin-secondary cursor-pointer"
						>
							{post.value.title && <h3 className="text-skin-base font-medium">{post.value.title}</h3>}
							{post.value.createdAt && (
								<time className="text-skin-tertiary whitespace-nowrap font-medium">
									{getFormattedDate(post.value.createdAt)}
								</time>
							)}
							{post.value.content && (
								<p className="line-clamp-3 mt-2 text-skin-base">{post.value.content}</p>
							)}
						</Link>
					)}
				</>
			))}
		</section>
	);
}
