import Button from "@/components/actions/button/Button";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";
import { getATRecords } from "@/lib/api/atmosphere/record";
import { createAgent } from "@/lib/api/bsky/agent";
import { getPDS } from "@/lib/api/bsky/identity/service";
import { getAtmosphereServiceLogo } from "@/lib/utils/image";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useState } from "react";
import AtmosphereContainerSkeleton from "./AtmosphereContainerSkeleton";
import AtmosphereNotFoundContainer from "./AtmosphereNotFoundContainer";
import FrontpageContainer from "./FrontpageContainer";
import LinkatContainer from "./LinkatContainer";
import WhiteWindContainer from "./WhiteWindContainer";

interface Props {
	handle: string;
	did: string;
}

export default function AtmosphereContainer(props: Props) {
	const { handle, did } = props;
	const [service, setService] = useState<string>();

	const {
		data: collections,
		isFetching: isFetchingCollections,
		error,
	} = useQuery({
		queryKey: ["atmosphere collections", did],

		queryFn: async () => {
			const pds = await getPDS(did);
			const agent = createAgent(pds);

			const frontpageRecords = await getATRecords(did, "fyi.unravel.frontpage.post", agent);
			const linkatRecords = await getATRecords(did, "blue.linkat.board", agent);
			const whtwndRecords = await getATRecords(did, "com.whtwnd.blog.entry", agent);

			return [
				{ name: "Frontpage", records: frontpageRecords.records },
				{ name: "Linkat", records: linkatRecords.records },
				{ name: "White Wind", records: whtwndRecords.records },
			];
		},
	});

	useLayoutEffect(() => {
		if (collections?.some((c) => c.records.length > 0)) {
			setService(collections.find((c) => c.records.length > 0)?.name);
		}
	}, [collections]);

	// biome-ignore lint/complexity/useOptionalChain: <explanation>
	const hasCollection = collections && collections.some((c) => c.records.length > 0);

	if (isFetchingCollections) return <AtmosphereContainerSkeleton />;

	if (error) return <FeedAlert variant="badResponse" message="Could not load atmosphere apps" standalone />;

	if (!hasCollection) {
		return <AtmosphereNotFoundContainer />;
	}

	const collectionMap = collections.reduce(
		(acc, collection) => {
			if (collection.records.length > 0) {
				acc[collection.name] = collection.records;
			}
			return acc;
		},
		{} as Record<string, any[]>,
	);

	const renderContainer = () => {
		switch (service) {
			case "Frontpage":
				return (
					collectionMap.Frontpage && <FrontpageContainer records={collectionMap.Frontpage} handle={handle} />
				);
			case "Linkat":
				return collectionMap.Linkat && <LinkatContainer records={collectionMap.Linkat} />;
			case "White Wind":
				return (
					collectionMap["White Wind"] && (
						<WhiteWindContainer records={collectionMap["White Wind"]} handle={handle} />
					)
				);
			default:
				return null;
		}
	};

	return (
		<section>
			<div className="sticky top-12 md:top-0 bg-skin-base border-skin-base md:border-x border-b">
				{hasCollection && (
					<ScrollArea.Root role="tablist">
						<div className="flex flex-nowrap items-center gap-2 overflow-x-auto p-3">
							{collections.map((c) => (
								// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
								<>
									{c.records.length !== 0 && (
										<Button
											key={c.name}
											onClick={() => {
												if (c.name === service) return;
												setService(c.name);
											}}
											className={`${
												c.name === service
													? "bg-skin-inverted text-skin-inverted"
													: "bg-skin-tertiary text-skin-secondary hover:brightness-95"
											} font-medium rounded-full px-2.5 py-2 min-w-fit gap-2`}
										>
											<img
												src={getAtmosphereServiceLogo(c.name)}
												alt={`${c} logo`}
												width={24}
												height={24}
												className="rounded-full"
											/>
											{c.name}
										</Button>
									)}
								</>
							))}
						</div>

						<ScrollArea.Scrollbar orientation="horizontal">
							<ScrollArea.Thumb />
						</ScrollArea.Scrollbar>
					</ScrollArea.Root>
				)}
			</div>

			{renderContainer()}
		</section>
	);
}
