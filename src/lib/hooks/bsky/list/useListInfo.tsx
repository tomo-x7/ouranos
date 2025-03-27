import { useAgent } from "@/app/providers/agent";
import { getListInfo } from "@/lib/api/bsky/list";
import { useQuery } from "@tanstack/react-query";

export const listInfoKey = (list: string) => ["listInfo", list];

export default function useFeedInfo(list: string) {
	const agent = useAgent();
	const { data, isLoading, isFetching, isRefetching, error } = useQuery({
		queryKey: listInfoKey(list),
		queryFn: async () => {
			return getListInfo(list, agent);
		},
	});

	return {
		listInfo: data,
		isLoadingListInfo: isLoading,
		isFetchingListInfo: isFetching,
		isRefetchingListInfo: isRefetching,
		listInfoError: error,
	};
}
