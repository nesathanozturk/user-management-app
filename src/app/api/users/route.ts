import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createUserApiSchema, userQuerySchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const queryResult = userQuerySchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
      maxAge: searchParams.get("maxAge") ?? undefined,
      minAge: searchParams.get("minAge") ?? undefined,
      page: searchParams.get("page") ?? undefined,
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { message: "Invalid query parameters", success: false },
        { status: 400 }
      );
    }

    const { limit, maxAge, minAge, page } = queryResult.data;

    const where: Record<string, unknown> = {};
    if (minAge !== undefined || maxAge !== undefined) {
      const ageFilter: Record<string, number> = {};
      if (minAge !== undefined) ageFilter.gte = minAge;
      if (maxAge !== undefined) ageFilter.lte = maxAge;
      where.age = ageFilter;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
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
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      pagination: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = createUserApiSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { errors, message: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const { age, email, firstName, lastName, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists", success: false },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        age,
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
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
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
