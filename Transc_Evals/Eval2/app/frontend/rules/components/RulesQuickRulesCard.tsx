const rules = [
	{
		emoji: "🎯",
		title: "Objective",
		description: "Checkmate your opponent's king while protecting your own king from threats.",
	},
	{
		emoji: "♟️",
		title: "How to Play",
		description:
			"Players alternate turns moving one piece at a time according to chess rules. Control the center, develop pieces, and create tactical opportunities.",
	},
	{
		emoji: "🏆",
		title: "Winning",
		description:
			"You win by checkmating your opponent. Games can also end in a draw by stalemate, repetition, insufficient material, or agreement.",
	},
];

export default function RulesQuickRulesCard() {
	return (
		<div
			className="backdrop-blur-xl border rounded-3xl p-10 shadow-2xl"
			style={{
				backgroundColor: "var(--overlay-light)",
				borderColor: "var(--border-primary)",
			}}
		>
			<h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
				Quick Rules
			</h2>
			<div className="space-y-4" style={{ color: "var(--text-primary)" }}>
				{rules.map((item) => (
					<div key={item.title} className="flex gap-4">
						<span className="text-2xl">{item.emoji}</span>
						<div>
							<h3 className="font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
								{item.title}
							</h3>
							<p>{item.description}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}