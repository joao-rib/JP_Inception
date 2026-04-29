const tutorials = [
	{
		title: "Chess Basics and Piece Movement",
		embedUrl: "https://www.youtube.com/embed/ej_fnsdsksA",
	},
	{
		title: "Openings, Tactics, and Midgame Ideas",
		embedUrl: "https://www.youtube.com/embed/Tt8VTZFPFa4",
	},
	{
		title: "Endgames and Checkmate Patterns",
		embedUrl: "https://www.youtube.com/embed/uu7ISsU-Ufw",
	},
];

export default function RulesTutorialsCard() {
	return (
		<div
			className="backdrop-blur-xl border rounded-3xl p-10 shadow-2xl"
			style={{
				backgroundColor: "var(--overlay-light)",
				borderColor: "var(--border-primary)",
			}}
		>
			<h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
				Video Tutorials
			</h2>
			<div className="space-y-6">
				{tutorials.map((tutorial) => (
					<div
						key={tutorial.title}
						className="border rounded-xl p-8"
						style={{
							backgroundColor: "var(--overlay-light)",
							borderColor: "var(--border-secondary)",
						}}
					>
						<h3 className="text-xl font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
							{tutorial.title}
						</h3>
						<div
							className="aspect-video rounded-lg overflow-hidden border"
							style={{
								backgroundColor: "var(--overlay-medium)",
								borderColor: "var(--border-secondary)",
							}}
						>
							<iframe
								className="h-full w-full"
								src={tutorial.embedUrl}
								title={tutorial.title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerPolicy="strict-origin-when-cross-origin"
								allowFullScreen
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
