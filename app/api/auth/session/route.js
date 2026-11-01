import { secured, json } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const GET = secured(async (_req, user) => json(user));
