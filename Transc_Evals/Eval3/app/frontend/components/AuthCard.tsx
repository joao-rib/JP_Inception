interface AuthCardProps {
	onLoginClick: () => void;
	onSignupClick: () => void;
}

export default function AuthCard({ onLoginClick, onSignupClick }: AuthCardProps) {
	return (
		<div
			className="backdrop-blur-xl border rounded-3xl p-10 shadow-2xl"
			style={{
				backgroundColor: "var(--overlay-light)",
				borderColor: "var(--border-primary)",
			}}
		>
			<div className="text-center space-y-8">
				<div>
					<h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
						Welcome Back
					</h2>
					<p className="text-sm" style={{ color: "var(--text-secondary)" }}>
						Sign in to start your journey
					</p>
				</div>

				<div className="space-y-4">
					<button
						onClick={onLoginClick}
						className="w-full font-bold py-5 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95"
						style={{
							background: "linear-gradient(to right, var(--avatar-mid), var(--avatar-end))",
							color: "var(--bg-primary)",
						}}
					>
						Login
					</button>

					<button
						onClick={onSignupClick}
						className="w-full font-semibold py-5 px-6 rounded-xl border-2 transition-all transform hover:scale-[1.02]"
						style={{
							backgroundColor: "var(--overlay-medium)",
							color: "var(--text-primary)",
							borderColor: "var(--border-primary)",
						}}
					>
						Create Account
					</button>
				</div>
			</div>
		</div>
	);
}
