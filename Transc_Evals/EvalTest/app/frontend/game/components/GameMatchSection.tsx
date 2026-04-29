interface GameMatchSectionProps {
  isSearching: boolean;
  matchStatus: string;
  onRankings: () => void;
  onStartGame: () => void;
}

export default function GameMatchSection({ isSearching, matchStatus, onRankings, onStartGame }: GameMatchSectionProps) {
  return (
    <main className="flex flex-col flex-1 items-center justify-center p-12">
      <div className="w-full max-w-2xl space-y-8">
        <h1
          className="mb-12 bg-clip-text text-center text-5xl font-bold text-transparent"
          style={{
            backgroundImage: `linear-gradient(to right, var(--gradient-start), var(--gradient-mid), var(--gradient-end))`,
          }}
        >
          ♟️ Chess Match! ♟️
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <button
            onClick={onRankings}
            className="group rounded-3xl p-10 backdrop-blur-xl transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "var(--overlay-light)",
              border: `1px solid var(--border-primary)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--overlay-medium)";
              e.currentTarget.style.borderColor = "var(--border-active)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--overlay-light)";
              e.currentTarget.style.borderColor = "var(--border-primary)";
            }}
          >
            <div className="mb-4 text-6xl">🏆</div>
            <h2
              className="mb-2 bg-clip-text text-3xl font-bold text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--gradient-start), var(--gradient-end))`,
              }}
            >
              Rankings
            </h2>
            <p style={{ color: "var(--text-muted)" }}>View leaderboard</p>
          </button>

          <button
            onClick={onStartGame}
            className="group rounded-3xl p-10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: `linear-gradient(to bottom right, var(--btn-primary-bg), var(--btn-primary-bg))`,
              border: `2px solid ${isSearching ? "var(--btn-primary-hover-border)" : "var(--btn-primary-border)"}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--btn-primary-hover-border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isSearching ? "var(--btn-primary-hover-border)" : "var(--btn-primary-border)";
            }}
          >
            <div className="mb-4 text-6xl">🎮</div>
            <h2
              className="mb-2 bg-clip-text text-3xl font-bold text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--gradient-start), var(--gradient-end))`,
              }}
            >
              {isSearching ? "Searching..." : "Start Game"}
            </h2>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              {isSearching ? "Click again to cancel" : "Find a random match"}
            </p>
            {matchStatus ? (
              <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
                {matchStatus}
              </p>
            ) : null}
          </button>
        </div>
      </div>
    </main>
  );
}
