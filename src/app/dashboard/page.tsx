import { useSession } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const { session, status } = useSession();
	const nav = useNavigate();
	useEffect(() => {
		if (status === "authenticated" && session) {
			nav("/dashboard/home");
		}
	}, [nav, status, session]);

	return <></>;
}
