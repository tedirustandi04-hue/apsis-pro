import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateSchema } from "@/lib/validations";
import { generateQuestions } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });

  try {
    const parsed = generateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map(i => i.message).join(" ") }, { status: 400 });
    }
    const result = await generateQuestions(parsed.data);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generasi gagal.";
    const status = message.includes("GEMINI_API_KEY") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
