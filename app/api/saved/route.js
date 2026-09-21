import { NextResponse } from "next/server";
import { list, add, remove } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await list("saved"));
}

export async function POST(req) {
  const body = await req.json();
  if (!body?.refId) return NextResponse.json({ error: "Thiếu refId" }, { status: 400 });
  const existing = (await list("saved")).find((x) => x.refId === body.refId);
  if (existing) return NextResponse.json(existing);
  const record = await add("saved", {
    refId: body.refId,
    name: body.name || "",
    cat: body.cat || "",
    image: body.image || "",
  });
  return NextResponse.json(record, { status: 201 });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("refId") || searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
  return NextResponse.json(await remove("saved", id));
}
