import { secured, touchSession, json } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const POST = secured(async (req) => {
  const result = await touchSession(req);
  return json(result);
});
