import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webjoz.com";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ seedId: string }> },
) {
  const { seedId } = await params;
  const res = await fetch(`${API_BASE_URL}/ai/public/seed-preview/${seedId}`, {
    cache: "no-store",
  });
  const envelope = await res.json().catch(() => null);
  const url = envelope?.data?.url;
  if (!res.ok || typeof url !== "string") {
    return new NextResponse("Seed not found", { status: 404 });
  }
  return NextResponse.redirect(url, 302);
}
