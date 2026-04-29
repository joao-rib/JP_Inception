"use client";

interface SignupModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	onSwitchToLogin: () => void;
	isLoading?: boolean;
	error?: string | null;
}

export default function SignupModal({ isOpen, onClose, onSubmit, onSwitchToLogin, isLoading = false, error = null }: SignupModalProps) {
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div 
				className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
				onClick={onClose}
			></div>
			
			{/* Modal */}
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top-10 fade-in duration-300">
				<div className="backdrop-blur-xl border rounded-2xl shadow-2xl p-8" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)" }}>
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Create Account</h3>
						<button 
							onClick={onClose}
							className="transition-colors hover:opacity-100"
							style={{ color: "var(--text-secondary)", opacity: 0.85 }}
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					
					<form onSubmit={onSubmit} className="space-y-4">
						<div>
							<label htmlFor="signup-username" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
								Username
							</label>
							<input
								id="signup-username"
								name="username"
								type="text"
								required
								placeholder="johndoe"
								disabled={isLoading}
								className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors disabled:opacity-50"
								style={{
									backgroundColor: "var(--overlay-light)",
									borderColor: "var(--border-primary)",
									color: "var(--text-primary)",
								}}
							/>
						</div>
						
						<div>
							<label htmlFor="signup-email" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
								Email
							</label>
							<input
								id="signup-email"
								name="email"
								type="email"
								required
								placeholder="your@email.com"
								disabled={isLoading}
								className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors disabled:opacity-50"
								style={{
									backgroundColor: "var(--overlay-light)",
									borderColor: "var(--border-primary)",
									color: "var(--text-primary)",
								}}
							/>
						</div>
						
						<div>
							<label htmlFor="signup-password" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
								Password
							</label>
							<input
								id="signup-password"
								name="password"
								type="password"
								required
								placeholder="••••••••"
								minLength={8}
								disabled={isLoading}
								className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors disabled:opacity-50"
								style={{
									backgroundColor: "var(--overlay-light)",
									borderColor: "var(--border-primary)",
									color: "var(--text-primary)",
								}}
							/>
						</div>
						
						{error && (
							<div className="p-3 rounded-lg text-sm" style={{ backgroundColor: "rgba(255, 0, 0, 0.1)", color: "#ff6b6b" }}>
								{error}
							</div>
						)}
						
						<button
							type="submit"
							disabled={isLoading}
							className="w-full font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
							style={{
								background: "linear-gradient(to right, var(--avatar-mid), var(--avatar-end))",
								color: "var(--bg-primary)",
							}}
						>
							{isLoading ? "Creating Account..." : "Create Account"}
						</button>
					</form>
					
					<div className="mt-6 text-center">
						<p className="text-sm" style={{ color: "var(--text-accent)" }}>
							Already have an account?{' '}
							<button 
								onClick={onSwitchToLogin}
								className="font-semibold transition-colors"
								style={{ color: "var(--text-primary)" }}
							>
								Sign in
							</button>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
