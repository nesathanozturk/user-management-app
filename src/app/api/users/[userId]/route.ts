import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!UUID_REGEX.test(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format", success: false },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      select: {
        age: true,
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
