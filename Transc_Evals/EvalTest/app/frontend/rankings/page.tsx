"use client";

import Background from "../components/Background";
import { useEffect, useState } from "react";
import RankingsBackLink from "./components/RankingsBackLink";
import RankingsHero from "./components/RankingsHero";
import RankingsLoading from "./components/RankingsLoading";
import RankingsError from "./components/RankingsError";
import RankingsTable from "./components/RankingsTable";

interface LeaderboardEntry {
	rank: number;
	username: string;
	wins: number;
	losses: number;
	rating: number;
	winRate: number;
	isCurrentUser?: boolean;
}

export default function Rankings() {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		const fetchLeaderboard = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch("/api/leaderboard", {
					signal: controller.signal,
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("Leaderboard request failed");
				}

				const data = (await response.json()) as LeaderboardEntry[];
				if (!Array.isArray(data) || data.length === 0) {
					throw new Error("Empty leaderboard response");
				}

				setLeaderboard(data);
			} catch (error) {
				console.error("[Rankings] Error loading leaderboard:", error);
				setError("Could not load the leaderboard right now.");
			} finally {
				setLoading(false);
			}
		};

		void fetchLeaderboard();

		return () => controller.abort();
	}, []);

	return (
		<div className="relative min-h-screen overflow-hidden font-sans">
			<Background />

			<RankingsBackLink />

			<main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 py-20">
				<div className="w-full max-w-5xl mx-auto space-y-8">
					<RankingsHero />

					{loading && <RankingsLoading />}

					{error && <RankingsError message={error} />}

					{!loading && !error && <RankingsTable leaderboard={leaderboard} />}
				</div>
			</main>
		</div>
	);
}