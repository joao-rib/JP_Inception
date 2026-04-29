import { BOARD_THEME_PALETTES, type BoardTheme } from "../utils/boardTheme";

interface GameSettingsPanelProps {
	isOpen: boolean;
	boardTheme: BoardTheme;
	onBoardThemeChange: (theme: BoardTheme) => void;
	onClose: () => void;
}

const BOARD_THEME_OPTIONS: BoardTheme[] = ["default", "classic", "bluish"];

export default function GameSettingsPanel({
	isOpen,
	boardTheme,
	onBoardThemeChange,
	onClose,
}: GameSettingsPanelProps) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
			<div
				className="w-full max-w-md rounded-3xl p-6 backdrop-blur-xl"
				style={{
					backgroundColor: "var(--bg-primary)",
					border: "1px solid var(--border-primary)",
				}}
			>
				<div className="mb-5 flex items-start justify-between gap-4">
					<div>
						<h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
							Board Settings
						</h2>
						<p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
							Choose the board color theme.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
						style={{
							backgroundColor: "var(--overlay-light)",
							border: "1px solid var(--border-primary)",
							color: "var(--text-primary)",
						}}
					>
						Close
					</button>
				</div>

				<div className="space-y-3">
					{BOARD_THEME_OPTIONS.map((theme) => {
						const palette = BOARD_THEME_PALETTES[theme];
						const isSelected = boardTheme === theme;
						const label = theme.charAt(0).toUpperCase() + theme.slice(1);

						return (
							<button
								key={theme}
								type="button"
								onClick={() => onBoardThemeChange(theme)}
								className="w-full rounded-2xl px-5 py-4 text-left transition-all duration-200"
								style={{
									backgroundColor: isSelected ? "var(--overlay-medium)" : "var(--overlay-light)",
									border: isSelected
										? "1px solid var(--border-active)"
										: "1px solid var(--border-primary)",
									color: "var(--text-primary)",
								}}
							>
								<div className="flex items-center justify-between gap-4">
									<div>
										<p className="text-lg font-semibold">{label}</p>
										<p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
											{palette.description}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<span
											className="h-5 w-5 rounded-sm border border-black/10"
											style={{ backgroundColor: palette.lightTile }}
										/>
										<span
											className="h-5 w-5 rounded-sm border border-black/10"
											style={{ backgroundColor: palette.darkTile }}
										/>
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
