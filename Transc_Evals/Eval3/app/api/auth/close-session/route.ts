import { NextResponse } from "next/server";

const AUTH_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
];

const buildCloseSessionResponse = (ok: boolean, status = 200) => {
  const response = NextResponse.json({ ok }, { status });

  for (const cookieName of AUTH_COOKIE_NAMES) {
    response.cookies.delete(cookieName);
  }

  return response;
};

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";

    if (cookieHeader) {
      const presenceUrl = new URL("/api/account/presence", request.url);

      await fetch(presenceUrl, {
        method: "POST",
        headers: {
          cookie: cookieHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "OFFLINE" }),
        cache: "no-store",
      }).catch((error) => {
        console.error("[POST /api/auth/close-session] Presence update failed:", error);
      });
    }

    return buildCloseSessionResponse(true);
  } catch (error) {
    console.error("[POST /api/auth/close-session] Error:", error);
    return buildCloseSessionResponse(false, 500);
  }
}
