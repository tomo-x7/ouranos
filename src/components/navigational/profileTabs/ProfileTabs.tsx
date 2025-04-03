import { useSession } from "@/lib/auth";
import { useLocation } from "react-router-dom";
import TabItem from "../tabs/TabItem";
import Tabs from "../tabs/Tabs";

export default function ProfileTabs() {
	const { pathname } = useLocation();
	const basePath = pathname.split("/").slice(0, 4).join("/");
	const { session } = useSession();

	return (
		<div className="overflow-x-hidden hover:overflow-x-auto">
			<Tabs>
				<TabItem label="Posts" path={`${basePath}`} isActive={pathname === `${basePath}`} />
				<TabItem label="Replies" path={`${basePath}/replies`} isActive={pathname === `${basePath}/replies`} />
				<TabItem label="Media" path={`${basePath}/media`} isActive={pathname === `${basePath}/media`} />
				{session?.handle === pathname.split("/")[3] && (
					<TabItem label="Likes" path={`${basePath}/likes`} isActive={pathname === `${basePath}/likes`} />
				)}
				<TabItem label="Lists" path={`${basePath}/lists`} isActive={pathname === `${basePath}/lists`} />
				<TabItem
					label="Atmosphere"
					path={`${basePath}/atmosphere`}
					isActive={pathname === `${basePath}/atmosphere`}
				/>
			</Tabs>
		</div>
	);
}
