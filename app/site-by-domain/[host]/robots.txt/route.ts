import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/site-config";

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
`;

// A parked site (expired plan) must not be crawled at all.
const SUSPENDED_ROBOTS = `User-agent: *
Disallow: /
`;

async function resolveRobots(host: string): Promise<string> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/public/sites?host=${encodeURIComponent(host)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) {
      const envelope = await res.json().catch(() => null);
      if (envelope?.code === "ERR_PLAN_EXPIRED") return SUSPENDED_ROBOTS;
      return DEFAULT_ROBOTS;
    }
    const envelope = await res.json();
    if (envelope.status !== "success") return DEFAULT_ROBOTS;
    const custom = envelope.data?.content?.seo?.custom_robots_txt;
    return typeof custom === "string" && custom.trim() ? custom : DEFAULT_ROBOTS;
  } catch {
    return DEFAULT_ROBOTS;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ host: string }> },
) {
  const { host } = await params;
  const body = await resolveRobots(host);
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
