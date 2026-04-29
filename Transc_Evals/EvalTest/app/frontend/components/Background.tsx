export default function Background() {
	return (
		<>
			{/* Clean Gradient Background */}
			<div
				className="absolute inset-0"
				style={{
					background: "linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary), var(--bg-accent))",
				}}
			></div>
			
			{/* Subtle grid pattern */}
			<div
				className="absolute inset-0"
				style={{
					opacity: "var(--grid-opacity)",
					backgroundImage:
						"linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)",
					backgroundSize: "50px 50px",
				}}
			></div>

			{/* Glowing orbs */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: "var(--btn-primary-bg)" }}></div>
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: "var(--overlay-medium)" }}></div>
		</>
	);
}
