import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const h = await headers();
  const obj: Record<string, string> = {};
  h.forEach((v, k) => {
    obj[k] = v;
  });
  return NextResponse.json(obj);
}
