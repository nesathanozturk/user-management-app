import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getClearAuthCookieConfig } from "@/lib/auth";

export async function POST() {
  try {
    const cookieConfig = getClearAuthCookieConfig();
    const cookieStore = await cookies();
    cookieStore.set(cookieConfig);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
