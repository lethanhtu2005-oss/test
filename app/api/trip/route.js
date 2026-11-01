import { personalCollection } from "@/lib/personalCollection";
export const dynamic = "force-dynamic";
const handlers = personalCollection("trip");
export const GET = handlers.GET;
export const POST = handlers.POST;
export const DELETE = handlers.DELETE;
