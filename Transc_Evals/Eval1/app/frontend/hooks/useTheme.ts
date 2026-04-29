"use client";

import { useEffect, useState } from "react";

export type Theme = "default" | "ocean" | "purple";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>("default");

	useEffect(() => {
		// Load theme from localStorage on mount
		const savedTheme = localStorage.getItem("app-theme") as Theme;
		if (savedTheme) {
			setTheme(savedTheme);
			applyTheme(savedTheme);
		}
	}, []);

	const applyTheme = (newTheme: Theme) => {
		// Remove existing theme
		document.documentElement.removeAttribute("data-theme");
		
		// Apply new theme (default doesn't need data-theme attribute)
		if (newTheme !== "default") {
			document.documentElement.setAttribute("data-theme", newTheme);
		}
	};

	const changeTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		applyTheme(newTheme);
		localStorage.setItem("app-theme", newTheme);
	};

	return { theme, changeTheme };
}
