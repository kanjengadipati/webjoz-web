import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/site-config";

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
`;

async function fetchCustomRobots(host: string): Promise<string | null> {
  const res = await fetch(
    `${API_BASE_URL}/public/sites?host=${encodeURIComponent(host)}`,
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
  { params }: { params: Promise<{ host: string }> },
) {
  const { host } = await params;
  const body = (await fetchCustomRobots(host)) ?? DEFAULT_ROBOTS;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
