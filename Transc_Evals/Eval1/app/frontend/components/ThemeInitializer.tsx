"use client";

import { useEffect } from "react";

const VALID_THEMES = new Set(["default", "ocean", "purple"]);

export default function ThemeInitializer() {
	useEffect(() => {
		const savedTheme = localStorage.getItem("app-theme");

		if (!savedTheme || !VALID_THEMES.has(savedTheme)) {
			document.documentElement.removeAttribute("data-theme");
			return;
		}

		if (savedTheme === "default") {
			document.documentElement.removeAttribute("data-theme");
			return;
		}

		document.documentElement.setAttribute("data-theme", savedTheme);
	}, []);

	return null;
}
