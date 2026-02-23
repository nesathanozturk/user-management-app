import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "@/types";

const COOKIE_NAME = "token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function getAuthCookieConfig(token: string) {
  return {
    httpOnly: true,
    maxAge: 86400,
    name: COOKIE_NAME,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    value: token,
  };
}

export function getClearAuthCookieConfig() {
  return {
    httpOnly: true,
    maxAge: 0,
    name: COOKIE_NAME,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    value: "",
  };
}

export { COOKIE_NAME };
