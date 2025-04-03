import Button from "@/components/actions/button/Button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
	const nav = useNavigate();

	return (
		<main className="flex h-[100svh] flex-col items-center justify-center p-3">
			<div className="flex items-center gap-3">
				<img src="/ouranos.svg" alt="Ouranos logo" width={40} height={40} />
				<img src="/ouranosText.svg" alt="Ouranos text" width={70} height={20} />
			</div>
			<h1 className="mt-2 text-center text-lg sm:text-xl">The page you are looking for could not be found</h1>
			<div className="mt-6 flex justify-center">
				<Button onClick={() => nav("/dashboard/home")}>Go Home</Button>
			</div>
		</main>
	);
}
