import { NextRequest, NextResponse } from "next/server";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/context";

const EN = "en";
const ID = "id";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/).*)"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Surface the current path to server components (RootLayout) so it can
  // resolve the locale from the URL segment — App Router server components
  // have no direct pathname access.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-webjoz-path", pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Pin the cookie for explicit locale segments so SSR + client render in that
  // language regardless of any pre-existing stored preference.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    response.cookies.set(LOCALE_STORAGE_KEY, EN, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  } else if (pathname === "/id" || pathname.startsWith("/id/")) {
    response.cookies.set(LOCALE_STORAGE_KEY, ID, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return response;
}
