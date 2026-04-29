export default function HomeHero() {
	return (
		<div className="text-center space-y-3 px-4">
			<h1
				className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text tracking-tight break-words"
				style={{
					backgroundImage:
						"linear-gradient(to right, var(--gradient-start), var(--gradient-mid), var(--gradient-end))",
				}}
			>
				ft_transcendence
			</h1>
			<p className="text-lg" style={{ color: "var(--text-accent)" }}>
				The Ultimate Chess Experience
			</p>
		</div>
	);
}
