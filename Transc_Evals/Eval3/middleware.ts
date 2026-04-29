import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: authSecret });

  if (token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/game/lobby", "/game/lobby/:path*"],
};
