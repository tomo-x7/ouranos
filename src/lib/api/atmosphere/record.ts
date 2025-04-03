import type AtpAgent from "@atproto/api";

export const getATRecords = async (did: string, collection: string, agent: AtpAgent) => {
	const result = await agent.com.atproto.repo.listRecords({
		repo: did,
		collection: collection,
		limit: 10,
	});

	if (!result.success) {
		throw new Error(`Could not get records from collection '${collection}'`);
	}

	return result.data;
};
