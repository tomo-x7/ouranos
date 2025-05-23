import Button from "@/components/actions/button/Button";
import Navbar from "../navbar/Navbar";

export default function SidePanel() {
	return (
		<menu className="hidden md:inline-flex items-center lg:items-start flex-col sticky top-6 h-full max-h-[91svh] overflow-y-hidden hover:overflow-y-auto">
			<Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline mb-8">
				<div className="flex items-center gap-3 group">
					<img
						src="/ouranos.svg"
						alt="Ouranos logo"
						width={44}
						height={44}
						fetchPriority="high"
						className="block transition-transform ease-in-out duration-700 group-hover:rotate-180"
					/>
					<img
						src="/ouranosText.svg"
						alt="Ouranos text"
						width={84}
						height={26}
						fetchPriority="high"
						className="hidden lg:block"
					/>
				</div>
			</Button>
			<Navbar />
		</menu>
	);
}
