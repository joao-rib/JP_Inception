import { NextResponse } from "next/server"; // send ok or error for browser
import { getServerSession } from "next-auth"; // verify if session is valid
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import authOptions from "../../auth/[...nextauth]/route";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: adapter as any });

/**
 * Lobby player data API route.
 *
 * This route:
 * 1. Validates the NextAuth session.
 * 2. Loads username/avatar from Account and chess stats from Score.
 * 3. Returns a normalized payload for the Lobby hook.
 */
export async function GET() { //request for read
	try {
		// Only the authenticated user can access their own lobby data.
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Fetch Account + Score(chess) in one query to reduce DB round trips.
		const account = await prisma.account.findUnique({
			where: { id: session.user.id },
			select: {
				username: true,
				avatarUrl: true,
				onlineStatus: true,
				score: {
					select: {
						rating: true,
						wins: true,
						losses: true,
					},
				},
			},
		});

		if (!account) {
			return NextResponse.json({ message: "Account not found" }, { status: 404 });
		}

		const score = account.score;

		// Normalize the payload with safe defaults for the frontend.
		return NextResponse.json({
			playerName: account.username,
			avatarUrl: account.avatarUrl,
			onlineStatus: account.onlineStatus,
			playerStats: {
				rating: score?.rating ?? 0,
				wins: score?.wins ?? 0,
				losses: score?.losses ?? 0,
			},
		});
	} catch (error) {
		console.error("[GET /api/lobby/player] Error:", error);
		return NextResponse.json(
			{ message: "Failed to load lobby player data" },
			{ status: 500 }
		);
	}
}