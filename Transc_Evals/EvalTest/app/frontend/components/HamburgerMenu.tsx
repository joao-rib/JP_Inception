"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";

const RULES_RETURN_TO_STORAGE_KEY = "ft-transcendence-rules-return-to";

interface HamburgerMenuProps {
	isOpen: boolean;
	onOpenSettings: () => void;
	onToggle: () => void;
}

export default function HamburgerMenu({ isOpen, onOpenSettings, onToggle }: HamburgerMenuProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryString = searchParams.toString();
	const returnTo = queryString ? `${pathname}?${queryString}` : pathname;
	const rulesHref = `/frontend/rules?returnTo=${encodeURIComponent(returnTo)}`;

	const handleRulesClick = () => {
		if (typeof window === "undefined") {
			return;
		}

		window.sessionStorage.setItem(RULES_RETURN_TO_STORAGE_KEY, returnTo);
	};

	return (
		<>
			<button
				onClick={onToggle}
				className="fixed top-6 right-6 z-50 rounded-lg border p-3 transition-all hover:opacity-90"
				style={{
					backgroundColor: "var(--overlay-light)",
					borderColor: "var(--border-secondary)",
				}}
				aria-label="Menu"
			>
				<div className="space-y-1.5">
					<span className="block h-0.5 w-6 rounded" style={{ backgroundColor: "var(--text-secondary)" }}></span>
					<span className="block h-0.5 w-6 rounded" style={{ backgroundColor: "var(--text-secondary)" }}></span>
					<span className="block h-0.5 w-6 rounded" style={{ backgroundColor: "var(--text-secondary)" }}></span>
				</div>
			</button>

			{isOpen && (
				<div
					className="fixed right-6 top-20 z-40 w-56 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-5 fade-in duration-200"
					style={{
						backgroundColor: "var(--bg-primary)",
						borderColor: "var(--border-primary)",
					}}
				>
					<nav className="space-y-2">
						<Link
							href={rulesHref}
							onClick={handleRulesClick}
							className="block rounded-lg px-4 py-3 text-[var(--text-primary)] transition-colors hover:bg-[var(--btn-primary-bg)]"
						>
							Rules
						</Link>
						<button
							type="button"
							onClick={onOpenSettings}
							className="block w-full rounded-lg px-4 py-3 text-left text-[var(--text-primary)] transition-colors hover:bg-[var(--btn-primary-bg)]"
						>
							Settings
						</button>
						<div className="my-2 border-t" style={{ borderColor: "var(--border-secondary)" }}></div>
						<a href="https://github.com/joao-rib/ft_transcendence" target="_blank" rel="noreferrer" className="block rounded-lg px-4 py-3 text-[var(--text-primary)] transition-colors hover:bg-[var(--btn-primary-bg)]">
							About
						</a>
						<div className="my-2 border-t pt-3" style={{ borderColor: "var(--border-secondary)" }}>
							<div className="px-1">
								<ThemeSwitcher direction="column" />
							</div>
						</div>
					</nav>
				</div>
			)}
		</>
	);
}
