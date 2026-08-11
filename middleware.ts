import { NextRequest, NextResponse } from "next/server";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/context";

const EN = "en";
const ID = "id";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/).*)"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Explicit locale segment pins the locale so SSR + client render in that
  // language regardless of any pre-existing stored preference.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    response.cookies.set(LOCALE_STORAGE_KEY, EN, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  } else if (pathname === "/id" || pathname.startsWith("/id/")) {
    response.cookies.set(LOCALE_STORAGE_KEY, ID, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return response;
}
