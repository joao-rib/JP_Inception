import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import authOptions from "../auth/[...nextauth]/route";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: adapter as any });

type FriendPayload = {
	id: string;
	name: string;
	status: "online" | "offline";
	isFriend?: boolean;
};

const buildFriendIds = (accountId: string, friendships: Array<{ userAId: string; userBId: string }>) => {
	const ids = new Set<string>();
	for (const friendship of friendships) {
		ids.add(friendship.userAId === accountId ? friendship.userBId : friendship.userAId);
	}
	return ids;
};

const mapFriend = (account: { id: string; username: string; onlineStatus: "ONLINE" | "OFFLINE" }): FriendPayload => ({
	id: account.id,
	name: account.username,
	status: account.onlineStatus === "ONLINE" ? "online" : "offline",
});

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const url = new URL(request.url);
		const rawQuery = url.searchParams.get("query")?.trim() ?? "";

		const friendships = await prisma.friendship.findMany({
			where: {
				OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
			},
			select: {
				userAId: true,
				userBId: true,
			},
		});

		const friendIds = buildFriendIds(session.user.id, friendships);

		if (rawQuery) {
			const matchedAccounts = await prisma.account.findMany({
				where: {
					AND: [
						{ id: { not: session.user.id } },
						{ username: { startsWith: rawQuery, mode: "insensitive" } },
					],
				},
				orderBy: { username: "asc" },
				select: {
					id: true,
					username: true,
					onlineStatus: true,
				},
			});

			return NextResponse.json({
				results: matchedAccounts.map((account) => ({
					...mapFriend(account),
					isFriend: friendIds.has(account.id),
				})),
			});
		}

		const friends = await prisma.account.findMany({
			where: { id: { in: [...friendIds] } },
			orderBy: { username: "asc" },
			select: {
				id: true,
				username: true,
				onlineStatus: true,
			},
		});

		return NextResponse.json({
			friends: friends.map(mapFriend),
		});
	} catch (error) {
		console.error("[GET /api/friends] Error:", error);
		return NextResponse.json({ message: "Failed to load friends" }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const body = (await request.json().catch(() => ({}))) as { friendId?: string };
		const friendId = body.friendId?.trim();

		if (!friendId) {
			return NextResponse.json({ message: "friendId is required" }, { status: 400 });
		}

		if (friendId === session.user.id) {
			return NextResponse.json({ message: "You cannot add yourself" }, { status: 400 });
		}

		const target = await prisma.account.findUnique({
			where: { id: friendId },
			select: { id: true },
		});

		if (!target) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		const [userAId, userBId] = [session.user.id, friendId].sort();

		try {
			await prisma.friendship.create({
				data: { userAId, userBId },
			});
		} catch (error) {
			const knownError = error as { code?: string };
			if (knownError.code !== "P2002") {
				throw error;
			}
		}

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("[POST /api/friends] Error:", error);
		return NextResponse.json({ message: "Failed to add friend" }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}