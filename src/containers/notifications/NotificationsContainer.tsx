"use client";

import TabItem from "@/components/navigational/tabs/TabItem";
import Tabs from "@/components/navigational/tabs/Tabs";
import { NOTIFICATION_FILTER } from "@/lib/consts/notification";
import { useState } from "react";
import FilteredNotificationsContainer from "./FilteredNotificationsContainer";

export default function NotificationsContainer() {
	const [currentTab, setCurrentTab] = useState<"all" | NotificationReason>("all");

	const handleTabChange = (tab: "all" | NotificationReason) => {
		setCurrentTab(tab);
	};

	return (
		<section>
			<Tabs>
				{NOTIFICATION_FILTER.map((type) => (
					<TabItem
						key={type.label}
						asButton
						onClick={() => handleTabChange(type.value)}
						label={type.label}
						isActive={currentTab === type.value}
					/>
				))}
			</Tabs>
			<FilteredNotificationsContainer filter={currentTab} />
		</section>
	);
}
