import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webjoz.com";
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com";

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
`;

async function fetchCustomRobots(subdomain: string): Promise<string | null> {
  const host = `${subdomain}.${BASE_DOMAIN}`;
  const res = await fetch(
    `${API_BASE_URL}/public/sites?host=${host}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  const envelope = await res.json();
  if (envelope.status !== "success") return null;
  const custom = envelope.data?.content?.seo?.custom_robots_txt;
  return typeof custom === "string" && custom.trim() ? custom : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ subdomain: string }> },
) {
  const { subdomain } = await params;
  const body = (await fetchCustomRobots(subdomain)) ?? DEFAULT_ROBOTS;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
