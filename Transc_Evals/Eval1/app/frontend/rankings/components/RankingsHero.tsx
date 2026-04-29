export default function RankingsHero() {
	return (
		<div className="text-center space-y-3">
			<h1
				className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text"
				style={{
					backgroundImage:
						"linear-gradient(to right, var(--gradient-start), var(--gradient-mid), var(--gradient-end))",
				}}
			>
				🏆 Rankings
			</h1>
			<p className="text-lg" style={{ color: "var(--text-accent)" }}>
				Chess Leaderboard - Top Players
			</p>
		</div>
	);
}
