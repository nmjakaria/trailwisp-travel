import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

export const GET = (req: NextRequest) => handler.GET(req);
export const POST = (req: NextRequest) => handler.POST(req);