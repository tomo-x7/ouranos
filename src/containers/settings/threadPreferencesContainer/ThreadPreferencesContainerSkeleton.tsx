function SortReplyItemSkeleton() {
	return (
		<div className="border-skin-base flex animate-pulse items-center gap-2 border border-x-0 p-3 last:border-b md:border-x md:first:rounded-t-2xl md:last:rounded-b-2xl odd:[&:not(:last-child)]:border-b-0 even:[&:not(:last-child)]:border-b-0">
			<div className="bg-skin-muted h-6 w-8 rounded-full" />
			<div className="bg-skin-muted h-6 w-1/3 rounded-full" />
		</div>
	);
}

export default function ThreadPreferencesContainerSkeleton() {
	return (
		<section className="flex flex-col gap-5">
			<h2 className="text-skin-base mx-3 mb-2 text-2xl font-semibold md:mx-0">Thread Preferences</h2>
			<section>
				<h3 className="text-skin-base mx-3 mb-2 text-xl font-semibold md:mx-0">Sort Replies</h3>
				<section className="flex flex-col">
					<SortReplyItemSkeleton />
					<SortReplyItemSkeleton />
					<SortReplyItemSkeleton />
					<SortReplyItemSkeleton />
				</section>
			</section>
			<section>
				<h3 className="text-skin-base mx-3 mb-2 text-xl font-semibold md:mx-0">Prioritize Your Follows</h3>
				<section className="flex flex-col">
					<SortReplyItemSkeleton />
				</section>
			</section>
		</section>
	);
}
