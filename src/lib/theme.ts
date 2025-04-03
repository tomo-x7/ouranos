import { createContext, useContext } from "react";

export type theme = "light" | "dim" | "dark";
type setTheme = (theme: theme) => void;
export const themeContext = createContext<[theme, setTheme]>(["light", () => void 0]);

export function useTheme(): [theme, setTheme] {
	return useContext(themeContext);
}

export function setTheme(theme: theme) {
	const html = document.getElementsByTagName("html")[0];
	html.dataset.theme = theme;
	localStorage.setItem("theme", theme);
}
export function getSavedTheme(): theme {
	const savedTheme = localStorage.getItem("theme");
	if (savedTheme === "light" || savedTheme === "dim" || savedTheme === "dark") {
		return savedTheme;
	} else {
		return "light";
	}
}
