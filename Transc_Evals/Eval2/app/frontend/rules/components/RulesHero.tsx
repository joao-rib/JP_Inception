export default function RulesHero() {
	return (
		<div className="text-center space-y-3">
			<h1
				className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text"
				style={{
					backgroundImage:
						"linear-gradient(to right, var(--gradient-start), var(--gradient-mid), var(--gradient-end))",
				}}
			>
				Chess Rules
			</h1>
			<p className="text-lg" style={{ color: "var(--text-accent)" }}>
				Learn the fundamentals of chess in ft_transcendence
			</p>
		</div>
	);
}