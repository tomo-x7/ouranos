import { THEMES } from "@/lib/store/local";

import { ToggleGroup, ToggleGroupItem } from "@/components/inputs/toggleGroup/ToggleGroup";
import { type theme, useTheme } from "@/lib/theme";
import type { ReactNode } from "react";

interface ItemProps {
	item: string;
	children: ReactNode;
}

function Item(props: ItemProps) {
	const { item, children } = props;

	return (
		<div className="border-skin-base flex items-center justify-between gap-3 border border-x-0 p-3 last:border-b md:border-x md:first:rounded-t-2xl md:last:rounded-b-2xl odd:[&:not(:last-child)]:border-b-0 even:[&:not(:last-child)]:border-b-0">
			<div className="flex flex-col">
				<span className="text-skin-base font-medium">{item}</span>
			</div>
			{children}
		</div>
	);
}

export default function AppearanceContainer() {
	const [theme, setTheme] = useTheme();

	return (
		<section className="flex flex-col gap-5">
			<h2 className="text-skin-base mx-3 mb-2 text-2xl font-semibold md:mx-0">Appearance</h2>

			<div>
				{theme && (
					<Item item={"Theme"}>
						<ToggleGroup
							type="single"
							defaultValue={theme}
							value={theme}
							onValueChange={(value: theme) => {
								if (!value) return;
								setTheme(value);
							}}
						>
							{THEMES.map((item) => (
								<ToggleGroupItem key={item.value} type="button" value={item.value}>
									{item.label}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</Item>
				)}
			</div>
		</section>
	);
}
