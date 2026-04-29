"use client";

import { useEffect, useState } from "react";
import {
applyBoardTheme,
broadcastBoardThemeChange,
BOARD_THEME_CHANGE_EVENT,
getStoredBoardTheme,
saveBoardTheme,
type BoardTheme,
} from "../utils/boardTheme";

export function useBoardThemeSettings() {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [boardTheme, setBoardTheme] = useState<BoardTheme>("default");

	useEffect(() => {
		const storedTheme = getStoredBoardTheme();
		setBoardTheme(storedTheme);
		applyBoardTheme(storedTheme);

		const handleThemeChange = (event: Event) => {
			const nextTheme = (event as CustomEvent<BoardTheme>).detail;
			setBoardTheme(nextTheme);
			applyBoardTheme(nextTheme);
		};

		window.addEventListener(BOARD_THEME_CHANGE_EVENT, handleThemeChange);

		return () => {
			window.removeEventListener(BOARD_THEME_CHANGE_EVENT, handleThemeChange);
		};
	}, []);

	const openSettings = () => {
		setIsSettingsOpen(true);
	};

	const closeSettings = () => {
		setIsSettingsOpen(false);
	};

	const toggleSettings = () => {
		setIsSettingsOpen((currentValue) => !currentValue);
	};

	const handleBoardThemeChange = (theme: BoardTheme) => {
		setBoardTheme(theme);
		saveBoardTheme(theme);
		applyBoardTheme(theme);
		broadcastBoardThemeChange(theme);
	};
		
	return {
		boardTheme,
		closeSettings,
		handleBoardThemeChange,
		isSettingsOpen,
		openSettings,
		toggleSettings,
	};
}
