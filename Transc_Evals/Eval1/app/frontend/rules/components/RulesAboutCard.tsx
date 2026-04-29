export default function RulesAboutCard() {
	return (
		<div
			className="backdrop-blur-xl border rounded-3xl p-10 shadow-2xl"
			style={{
				backgroundColor: "var(--overlay-light)",
				borderColor: "var(--border-primary)",
			}}
		>
			<h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
				About the Game
			</h2>
			<p className="text-lg leading-relaxed" style={{ color: "var(--text-primary)" }}>
				ft_transcendence is a competitive online <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>chess</span> experience where every move matters.
				 Play against friends or players around the world, sharpen your tactical vision, and improve your strategic decision-making.
				 From opening principles to endgame precision, each match is a chance to grow and climb the rankings.
			</p>
		</div>
	);
}