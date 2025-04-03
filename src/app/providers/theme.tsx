import { getSavedTheme, setTheme as setThemeOuter, type theme, themeContext } from "@/lib/theme";
import { type ReactNode, useCallback, useState } from "react";

interface Props {
	children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
	const [theme, setThemeInner] = useState<theme>(getSavedTheme);
	const setTheme = useCallback((theme: theme) => {
		setThemeInner(theme);
		setThemeOuter(theme);
	}, []);
	return <themeContext.Provider value={[theme, setTheme]}>{children}</themeContext.Provider>;
}
