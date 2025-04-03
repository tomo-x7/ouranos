import { BiRepost, BiSolidErrorAlt, BiSolidHeart, BiSolidUserPlus } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { HiMiniShieldExclamation } from "react-icons/hi2";
import { IoMdGlobe } from "react-icons/io";
import { IoCloudOffline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { VscMention } from "react-icons/vsc";
import type { FeedAlert, ThreadgateSetting } from "../../../types/feed";

export function getAlertIcon(variant: "success" | "error" | "info" | "warning") {
	switch (variant) {
		case "success":
			return <FaCircleCheck className="text-skin-icon-base text-2xl" />;
		case "error":
			return <HiMiniShieldExclamation className="text-skin-icon-base text-2xl" />;
		case "info":
			return <PiWarningCircleFill className="text-skin-icon-base text-2xl" />;
		case "warning":
			return <PiWarningCircleFill className="text-skin-icon-base text-2xl" />;
		default:
			return <PiWarningCircleFill className="text-skin-icon-base text-2xl" />;
	}
}

export function getFeedAlertIcon(variant: FeedAlert) {
	switch (variant) {
		case "empty":
			return <PiWarningCircleFill className="text-skin-icon-base text-2xl" />;
		case "doesNotExist":
			return <PiWarningCircleFill className="text-skin-icon-base text-2xl" />;
		case "misconfigured":
			return <HiMiniShieldExclamation className="text-skin-icon-base text-2xl" />;
		case "badResponse":
			return <BiSolidErrorAlt className="text-skin-icon-base text-2xl" />;
		case "offline":
			return <IoCloudOffline className="text-skin-icon-base text-2xl" />;
		case "blocked":
			return <HiMiniShieldExclamation className="text-skin-icon-base text-2xl" />;
		default:
			return <PiWarningCircleFill className="text-skin-icon-base text-2xl" />;
	}
}

export const getNotificationIcon = (reason: string) => {
	switch (reason) {
		case "like":
			return <BiSolidHeart className="text-skin-icon-like shrink-0 text-2xl" />;
		case "repost":
			return <BiRepost className="text-skin-icon-repost shrink-0 text-2xl" />;
		case "follow":
			return <BiSolidUserPlus className="text-primary shrink-0 text-2xl" />;
		default:
			return null;
	}
};

export const getThreadGateIcon = (value: ThreadgateSetting[]) => {
	if (value.length === 0) return <IoMdGlobe />;
	if (value.length === 1) {
		if (value[0] === "nobody") return <MdBlock />;
		if (value[0] === "following") return <FaUserCheck />;
		if (value[0] === "mention") return <VscMention />;
	}

	if (value.length === 2) {
		return <BsFillPeopleFill />;
	}
};
