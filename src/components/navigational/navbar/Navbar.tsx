"use client";

import { usePathname } from "next/navigation";
import NavItem from "./NavItem";

import { useAgent } from "@/app/providers/agent";
import { getUnreadNotificationsCount } from "@/lib/api/bsky/notification";
import { useQuery } from "@tanstack/react-query";
import { BiCog, BiHome, BiPlanet, BiSolidCog, BiSolidHome, BiSolidPlanet } from "react-icons/bi";
import { FaBell, FaRegBell } from "react-icons/fa6";
import { HiClipboardList, HiOutlineClipboardList } from "react-icons/hi";
import { PiMagnifyingGlassBold, PiMagnifyingGlassFill } from "react-icons/pi";

export default function Navbar() {
	const agent = useAgent();
	const pathname = usePathname();

	const {
		data: notificationsCount,
		error,
		isFetching,
	} = useQuery({
		queryKey: ["notificationsCount"],
		queryFn: async () => {
			return getUnreadNotificationsCount(agent);
		},
		refetchInterval: 10000,
	});

	return (
		<nav className="inline-flex flex-col gap-5 lg:ml-1.5">
			<NavItem
				href="/dashboard/home"
				icon={<BiHome className="text-2xl md:text-3xl" />}
				activeIcon={<BiSolidHome className="text-2xl md:text-3xl" />}
				title="Home"
				isActive={pathname === "/dashboard/home"}
			/>
			<NavItem
				href="/dashboard/search"
				icon={<PiMagnifyingGlassBold className="text-2xl md:text-3xl" />}
				activeIcon={<PiMagnifyingGlassFill className="text-2xl md:text-3xl" />}
				title="Search"
				isActive={pathname.includes("search")}
			/>
			<NavItem
				href="/dashboard/feeds"
				icon={<BiPlanet className="text-2xl md:text-3xl" />}
				activeIcon={<BiSolidPlanet className="text-2xl md:text-3xl" />}
				title="Feeds"
				isActive={pathname === "/dashboard/feeds"}
			/>
			<NavItem
				href="/dashboard/lists"
				icon={<HiOutlineClipboardList className="text-2xl md:text-3xl" />}
				activeIcon={<HiClipboardList className="text-2xl md:text-3xl" />}
				title="Lists"
				isActive={pathname === "/dashboard/lists"}
			/>
			<NavItem
				href="/dashboard/notifications"
				icon={<FaRegBell className="text-2xl md:text-3xl" />}
				activeIcon={<FaBell className="text-2xl md:text-3xl" />}
				title="Notifications"
				isActive={pathname.includes("notifications")}
				badge={notificationsCount ?? 0}
			/>
			<NavItem
				href="/dashboard/settings"
				icon={<BiCog className="text-2xl md:text-3xl" />}
				activeIcon={<BiSolidCog className="text-2xl md:text-3xl" />}
				title="Settings"
				isActive={pathname.includes("settings")}
			/>
		</nav>
	);
}
