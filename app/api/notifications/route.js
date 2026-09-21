import { NextResponse } from "next/server";
import { list, add } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const business = searchParams.get("business");
  let all = await list("notifications");
  if (role) all = all.filter((n) => n.role === role);
  if (business) all = all.filter((n) => !n.businessId || n.businessId === business);
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  const record = await add("notifications", {
    role: body.role || "traveler",
    businessId: body.businessId || null,
    type: body.type || "info",
    message: body.message || "",
  });
  return NextResponse.json(record, { status: 201 });
}
