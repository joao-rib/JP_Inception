/**
 * Lobby background layer.
 *
 * This component:
 * 1. Draws the base gradient using shared theme variables.
 * 2. Adds a subtle grid overlay for depth.
 * 3. Uses no props because it depends only on global CSS variables.
 */
export default function GameBackground() {
	return (
		<>
			{/* Base gradient background */}
			<div
				className="absolute inset-0"
				style={{
					background: `linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary), var(--bg-accent))`,
				}}
			></div>

			{/* Subtle grid overlay */}
			<div
				className="absolute inset-0"
				style={{
					opacity: "var(--grid-opacity)",
					backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
					backgroundSize: "50px 50px",
				}}
			></div>
		</>
	);
}
