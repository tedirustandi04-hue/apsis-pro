import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = loginSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json({ error: "Email atau password tidak valid." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.data.email.toLowerCase() }
    });

    if (!user || !(await verifyPassword(body.data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch {
    return NextResponse.json({ error: "Layanan login belum tersedia. Periksa konfigurasi server." }, { status: 500 });
  }
}
