import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;

  if (
    url.pathname.startsWith("/api/zxc-backend") ||
    url.pathname.startsWith("/embed") ||
    url.pathname.startsWith("/")
  ) {
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    console.log(
      `[ACCESS LOG] ${new Date().toISOString()}
IP: ${clientIP}
Path: ${url.pathname}
UA: ${userAgent}`
    );

    // Correct way to inject internal key
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-api-key", process.env.TANIME_API_KEY!);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/zxc-backend/:path*", "/embed/:path*", "/"],
};
