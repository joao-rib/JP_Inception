interface GamePlayerSidebarProps {
	playerName: string;
	// Account.avatarUrl from the database. It can be null.
	avatarUrl?: string | null;
	// Chess rating stored in Score.rating.
	rating: number;
	wins: number;
	losses: number;
	onFriends: () => void;
	onSettings: () => void;
	onDisconnect: () => void;
}

export default function GamePlayerSidebar({
	playerName,
	avatarUrl,
	rating,
	wins,
	losses,
	onFriends,
	onSettings,
	onDisconnect,
}: GamePlayerSidebarProps) {
	/**
	 * Lobby player sidebar.
	 *
	 * This component:
	 * 1. Shows the authenticated player's avatar and username.
	 * 2. Displays Score-based stats (rank, wins, losses).
	 * 3. Keeps the previous visual fallback when no avatar URL exists.
	 */
	return (
		<aside className="w-96 flex-shrink-0 p-6" style={{ borderRight: `1px solid var(--border-secondary)` }}>
			<div
				className="backdrop-blur-xl rounded-2xl p-6 h-full flex flex-col space-y-6"
				style={{
					backgroundColor: "var(--overlay-light)",
					border: `1px solid var(--border-primary)`,
				}}
			>
				<div className="text-center space-y-3">
					{/* Render the DB avatar when available; otherwise fall back to the default initial badge. */}
					{avatarUrl ? (
						<img
							src={avatarUrl}
							alt={`${playerName} avatar`}
							className="w-24 h-24 mx-auto rounded-full object-cover border-4"
							style={{
								borderColor: "var(--avatar-border)",
							}}
						/>
					) : (
						<div
							className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl font-bold text-slate-900 border-4"
							style={{
								background: `linear-gradient(to bottom right, var(--avatar-start), var(--avatar-mid), var(--avatar-end))`,
								borderColor: "var(--avatar-border)",
							}}
						>
							{playerName.charAt(0).toUpperCase()}
						</div>
					)}
					<h2
						className="text-2xl font-bold text-transparent bg-clip-text"
						style={{
							backgroundImage: `linear-gradient(to right, var(--gradient-start), var(--gradient-mid), var(--gradient-end))`,
						}}
					>
						{playerName}
					</h2>
				</div>

				<div className="space-y-3 flex-grow">
					<div
						className="rounded-xl p-4"
						style={{
							backgroundColor: "var(--overlay-light)",
							border: `1px solid var(--border-secondary)`,
						}}
					>
						<p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
							Rating
						</p>
						{rating}
					</div>
					<div
						className="rounded-xl p-4"
						style={{
							backgroundColor: "var(--overlay-light)",
							border: `1px solid var(--border-secondary)`,
						}}
					>
						<p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
							Wins
						</p>
						{wins}
					</div>
					<div
						className="rounded-xl p-4"
						style={{
							backgroundColor: "var(--overlay-light)",
							border: `1px solid var(--border-secondary)`,
						}}
					>
						<p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
							Losses
						</p>
						{losses}
					</div>
				</div>

				<div className="space-y-3 pt-4" style={{ borderTop: `1px solid var(--border-secondary)` }}>
					<button
						onClick={onFriends}
						className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
						style={{
							backgroundColor: "var(--overlay-light)",
							border: `1px solid var(--border-primary)`,
							color: "var(--text-primary)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "var(--overlay-medium)";
							e.currentTarget.style.borderColor = "var(--border-hover)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "var(--overlay-light)";
							e.currentTarget.style.borderColor = "var(--border-primary)";
						}}
					>
						👥 Friends
					</button>
					<button
						onClick={onSettings}
						className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
						style={{
							backgroundColor: "var(--overlay-light)",
							border: `1px solid var(--border-primary)`,
							color: "var(--text-primary)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "var(--overlay-medium)";
							e.currentTarget.style.borderColor = "var(--border-hover)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "var(--overlay-light)";
							e.currentTarget.style.borderColor = "var(--border-primary)";
						}}
					>
						⚙️ Settings
					</button>
					<button
						onClick={onDisconnect}
						className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
						style={{
							backgroundColor: "var(--danger-bg)",
							border: `1px solid var(--danger-border)`,
							color: "var(--danger-text)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "var(--danger-bg-hover)";
							e.currentTarget.style.borderColor = "var(--danger-border-hover)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "var(--danger-bg)";
							e.currentTarget.style.borderColor = "var(--danger-border)";
						}}
					>
						🚪 Disconnect
					</button>
				</div>
			</div>
		</aside>
	);
}
