"use client";

import HamburgerMenu from "./HamburgerMenu";
import GameSettingsPanel from "../game/components/GameSettingsPanel";
import { useBoardThemeSettings } from "../game/hooks/useBoardThemeSettings";
import { useState } from "react";

export default function GlobalHamburgerMenu() {
	const [menuOpen, setMenuOpen] = useState(false);
	const {
		boardTheme,
		closeSettings,
		handleBoardThemeChange,
		isSettingsOpen,
		openSettings,
	} = useBoardThemeSettings();

	const handleOpenSettings = () => {
		setMenuOpen(false);
		openSettings();
	};

	return (
		<>
			<HamburgerMenu
				isOpen={menuOpen}
				onOpenSettings={handleOpenSettings}
				onToggle={() => setMenuOpen((previous) => !previous)}
			/>
			<GameSettingsPanel
				isOpen={isSettingsOpen}
				boardTheme={boardTheme}
				onBoardThemeChange={handleBoardThemeChange}
				onClose={closeSettings}
			/>
		</>
	);
}
