"use client";

import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error() {
	return <FeedAlert variant="doesNotExist" message="Feed was not found" />;
}
