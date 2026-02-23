import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

async function verifyTokenEdge(
  token: string,
): Promise<{ email: string; role: string; userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as {
      email: string;
      role: string;
      userId: string;
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isApiRoute = pathname.startsWith("/api/");
  const isLoginPage = pathname === "/";
  const isLoginApi = pathname === "/api/auth/login";
  const isLogoutApi = pathname === "/api/auth/logout";

  if (isLoginApi || isLogoutApi) {
    return NextResponse.next();
  }

  if (isLoginPage) {
    if (token) {
      const payload = await verifyTokenEdge(token);
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const payload = await verifyTokenEdge(token);

  if (!payload) {
    if (isApiRoute) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-role", payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/users/:path*"],
};
