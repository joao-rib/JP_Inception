import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import authOptions from "../auth/[...nextauth]/route";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: adapter as any });

type LeaderboardEntry = {
	rank: number;
	username: string;
	wins: number;
	losses: number;
	rating: number;
	winRate: number;
	isCurrentUser: boolean;
};

const toLeaderboardEntry = (
	account: {
		id: string;
		username: string;
		score: { rating: number; wins: number; losses: number } | null;
	},
	isCurrentUser: boolean
): Omit<LeaderboardEntry, "rank"> => {
	const wins = account.score?.wins ?? 0;
	const losses = account.score?.losses ?? 0;
	const rating = account.score?.rating ?? 0;
	const gamesPlayed = wins + losses;

	return {
		username: account.username,
		wins,
		losses,
		rating,
		winRate: gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0,
		isCurrentUser,
	};
};

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const friendships = await prisma.friendship.findMany({
			where: {
				OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
			},
			select: { userAId: true, userBId: true },
		});

		const friendIds = friendships.flatMap((friendship) => [
			friendship.userAId === session.user.id ? friendship.userBId : friendship.userAId,
		]);

		const accounts = await prisma.account.findMany({
			where: { id: { in: [session.user.id, ...friendIds] } },
			select: {
				id: true,
				username: true,
				score: {
					select: {
						rating: true,
						wins: true,
						losses: true,
					},
				},
			},
		});

		const leaderboard = accounts
			.map((account) => toLeaderboardEntry(account, account.id === session.user.id))
			.sort((left, right) => {
				if (right.rating !== left.rating) return right.rating - left.rating;
				if (right.wins !== left.wins) return right.wins - left.wins;
				if (left.losses !== right.losses) return left.losses - right.losses;
				return left.username.localeCompare(right.username);
			})
			.map((entry, index) => ({ ...entry, rank: index + 1 }));

		return NextResponse.json(leaderboard);
	} catch (error) {
		console.error("[GET /api/leaderboard] Error:", error);
		return NextResponse.json({ message: "Failed to load leaderboard" }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}