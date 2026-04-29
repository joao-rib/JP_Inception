export default function HomeFeatureCards() {
	return (
		<div className="flex justify-center gap-4 flex-wrap">
			<div
				className="w-48 border rounded-xl p-5 text-center transition-all"
				style={{
					backgroundColor: "var(--overlay-light)",
					borderColor: "var(--border-secondary)",
				}}
			>
				<div className="text-3xl mb-2">🏆</div>
				<h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
					Rankings
				</h3>
			</div>
		</div>
	);
}
