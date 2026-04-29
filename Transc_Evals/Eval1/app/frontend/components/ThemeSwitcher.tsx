"use client";

import { useTheme, type Theme } from "@/app/frontend/hooks/useTheme";

interface ThemeSwitcherProps {
	direction?: "row" | "column";
}

export default function ThemeSwitcher({ direction = "row" }: ThemeSwitcherProps) {
	const { theme, changeTheme } = useTheme();
    const isColumn = direction === "column";

	const themes: { value: Theme; label: string; emoji: string }[] = [
		{ value: "default", label: "Amber", emoji: "🟡" },
		{ value: "ocean", label: "Ocean", emoji: "🌊" },
		{ value: "purple", label: "Purple", emoji: "🟣" },
	];

	return (
		<div
			className={`flex rounded-xl px-3 py-2 border ${
				isColumn ? "flex-col items-stretch gap-2" : "items-center gap-2"
			}`}
			style={{
				backgroundColor: "var(--overlay-light)",
				borderColor: "var(--border-secondary)",
			}}
		>
			<span
				className={`text-xs font-semibold uppercase tracking-wide ${
					isColumn ? "mb-1" : ""
				}`}
				style={{ color: "var(--text-secondary)" }}
			>
				Themes
			</span>
			{themes.map((t) => (
				<button
					key={t.value}
					onClick={() => changeTheme(t.value)}
					className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold ${
						isColumn ? "w-full text-left" : ""
					} ${
						theme === t.value ? "scale-105" : "opacity-60 hover:opacity-100"
					}`}
					style={{
						backgroundColor:
							theme === t.value ? "var(--overlay-medium)" : "var(--overlay-light)",
						border: `1px solid ${
							theme === t.value ? "var(--border-hover)" : "var(--border-primary)"
						}`,
						color: "var(--text-primary)",
					}}
					title={t.label}
				>
					<span>
						{t.emoji} {t.label}
					</span>
				</button>
			))}
		</div>
	);
}
