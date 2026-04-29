import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import authOptions from "../../auth/[...nextauth]/route";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: adapter as any });

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const body = (await request.json().catch(() => ({}))) as {
			status?: "ONLINE" | "OFFLINE";
		};

		const nextStatus = body.status ?? "ONLINE";

		await prisma.account.update({
			where: { id: session.user.id },
			data: { onlineStatus: nextStatus },
		});

		return NextResponse.json({ ok: true, status: nextStatus });
	} catch (error) {
		console.error("[POST /api/account/presence] Error:", error);
		return NextResponse.json(
			{ message: "Failed to update presence" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}