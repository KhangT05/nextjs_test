import { NextRequest, NextResponse } from "next/server";
import { ruleBasedReply } from "@/lib/chatRules";

export async function POST(req: NextRequest) {
  let messages: { role: string; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const last = messages.at(-1)?.content ?? "";

  // Simulate ~300ms latency so loading state is visible
  await new Promise((r) => setTimeout(r, 300));

  return NextResponse.json({ content: ruleBasedReply(last) });
}
