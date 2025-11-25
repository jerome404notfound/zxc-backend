import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Apply only to your API route
  if (url.pathname.startsWith("/api/zxc-backend")) {
    const res = NextResponse.next();
    res.headers.set("x-api-key", process.env.INTERNAL_TANIME_KEY!);
    return res;
  }

  return NextResponse.next();
}
