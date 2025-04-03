export enum LocalStorage {
	Theme = "theme",
}

export const THEMES = [
	{ label: "Light", value: "light" },
	{ label: "Dim", value: "dim" },
	{ label: "Dark", value: "dark" },
] as const;
