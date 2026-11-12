import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "apsis_session";
const secret = process.env.AUTH_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("AUTH_SECRET wajib diisi minimal 32 karakter.");
}

const key = new TextEncoder().encode(secret);

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    if (!payload.sub) return null;

    return {
      id: payload.sub,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? "TEACHER")
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function clearSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getUserSchool(userId: string) {
  return prisma.schoolMember.findFirst({
    where: { userId },
    include: { school: true },
    orderBy: { joinedAt: "asc" }
  });
}
