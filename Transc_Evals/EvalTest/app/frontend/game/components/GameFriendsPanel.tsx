interface FriendEntry {
	id: string;
	name: string;
	status: "online" | "offline";
	isFriend?: boolean;
}

interface GameFriendsPanelProps {
	friends: FriendEntry[];
	isOpen: boolean;
	friendSearchMessage: string | null;
	friendSearchQuery: string;
	friendSearchResults: FriendEntry[];
	isLoading: boolean;
	onAddFriend: (friendId: string) => void;
	onClose: () => void;
	onFind: () => void;
	onQueryChange: (value: string) => void;
}

export default function GameFriendsPanel({
	friends,
	isOpen,
	friendSearchMessage,
	friendSearchQuery,
	friendSearchResults,
	isLoading,
	onAddFriend,
	onClose,
	onFind,
	onQueryChange,
}: GameFriendsPanelProps) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
			<div
				className="w-full max-w-md rounded-3xl p-6 backdrop-blur-xl"
				style={{
					backgroundColor: "var(--bg-primary)",
					border: "1px solid var(--border-primary)",
				}}
			>
				<div className="mb-5 flex items-start justify-between gap-4">
					<div className="flex-1">
						<h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
							Friends
						</h2>
						<div className="mt-4 flex gap-3">
							<input
								type="text"
								value={friendSearchQuery}
								onChange={(event) => onQueryChange(event.target.value)}
								placeholder="Search users by name"
								className="w-full rounded-xl px-4 py-3 text-sm outline-none"
								style={{
									backgroundColor: "var(--overlay-light)",
									border: "1px solid var(--border-primary)",
									color: "var(--text-primary)",
								}}
							/>
							<button
								type="button"
								onClick={onFind}
								disabled={isLoading}
								className="rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60"
								style={{
									backgroundColor: "var(--btn-primary-bg)",
									color: "var(--text-primary)",
								}}
							>
								Find
							</button>
						</div>
						<p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
							Your friend list for quick match invites.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
						style={{
							backgroundColor: "var(--overlay-light)",
							border: "1px solid var(--border-primary)",
							color: "var(--text-primary)",
						}}
					>
						Close
					</button>
				</div>

				{friendSearchMessage ? (
					<p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
						{friendSearchMessage}
					</p>
				) : null}

				{friendSearchResults.length > 0 ? (
					<div className="mb-5 space-y-3">
						<p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
							Search Results
						</p>
						{friendSearchResults.map((result) => {
							const isOnline = result.status === "online";
							const alreadyFriend = Boolean(result.isFriend);

							return (
								<div
									key={result.id}
									className="flex items-center justify-between rounded-2xl px-4 py-3"
									style={{
										backgroundColor: "var(--overlay-light)",
										border: "1px solid var(--border-primary)",
									}}
								>
									<div className="flex items-center gap-3">
										<span
											className="h-2.5 w-2.5 rounded-full"
											style={{ backgroundColor: isOnline ? "#22c55e" : "#64748b" }}
										/>
										<span className="font-medium" style={{ color: "var(--text-primary)" }}>
											{result.name}
										</span>
									</div>
									<button
										type="button"
										onClick={() => onAddFriend(result.id)}
										disabled={alreadyFriend}
										className="rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60"
										style={{
											backgroundColor: "var(--btn-primary-bg)",
											color: "var(--text-primary)",
										}}
									>
										{alreadyFriend ? "Friend" : "Add Friend"}
									</button>
								</div>
							);
						})}
					</div>
				) : null}

				<div className="space-y-3">
					{friends.length === 0 ? (
						<p className="text-sm" style={{ color: "var(--text-muted)" }}>
							No friends yet.
						</p>
					) : null}
					{friends.length > 0 ? (
						<p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
							YOURS FRIENDS
						</p>
					) : null}
					{friends.map((friend) => {
						const isOnline = friend.status === "online";

						return (
							<div
								key={friend.id}
								className="flex items-center justify-between rounded-2xl px-4 py-3"
								style={{
									backgroundColor: "var(--overlay-light)",
									border: "1px solid var(--border-primary)",
								}}
							>
								<div className="flex items-center gap-3">
									<span
										className="h-2.5 w-2.5 rounded-full"
										style={{ backgroundColor: isOnline ? "#22c55e" : "#64748b" }}
									/>
									<span className="font-medium" style={{ color: "var(--text-primary)" }}>
										{friend.name}
									</span>
								</div>
								<span className="text-sm" style={{ color: "var(--text-muted)" }}>
									{isOnline ? "Online" : "Offline"}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
