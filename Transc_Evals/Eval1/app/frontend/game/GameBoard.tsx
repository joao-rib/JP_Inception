"use client";

/**
	 * Placeholder board panel for the game area.
 *
	 * This component:
	 * 1. Reserves space for the future game board implementation.
	 * 2. Keeps a consistent visual style with the current UI.
	 * 3. Allows incremental development without blocking the layout.
 */
export default function GameBoard() {
	return (
		<div className="bg-white/5 backdrop-blur-xl border border-yellow-600/30 rounded-3xl p-10">
			<div className="text-center space-y-4">
				<h2 className="text-2xl font-bold text-yellow-100">Game Board</h2>
				<p className="text-yellow-300">Your game logic goes here</p>
			</div>
		</div>
	);
}
