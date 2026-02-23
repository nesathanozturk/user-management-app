import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { excelRowSchema } from "@/lib/validations";
import type { BulkUploadError } from "@/types";

const ALLOWED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const REQUIRED_HEADERS = ["name", "surname", "email", "age", "password"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided", success: false },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Please upload an Excel file (.xlsx or .xls)", success: false },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size exceeds 5MB limit", success: false },
        { status: 400 }
      );
    }

    const { read, utils } = await import("xlsx");

    const buffer = await file.arrayBuffer();
    const workbook = read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return NextResponse.json(
        { message: "Excel file has no sheets", success: false },
        { status: 400 }
      );
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = utils.sheet_to_json<Record<string, unknown>>(sheet);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Excel file has no data rows", success: false },
        { status: 400 }
      );
    }

    const headers = Object.keys(rows[0]).map((h) => h.toLowerCase().trim());
    const missingHeaders = REQUIRED_HEADERS.filter(
      (h) => !headers.includes(h)
    );

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        {
          message: `Missing required columns: ${missingHeaders.join(", ")}`,
          success: false,
        },
        { status: 400 }
      );
    }

    const errors: BulkUploadError[] = [];
    const validRows: { age: number; email: string; firstName: string; lastName: string; password: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i];
      const normalized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(raw)) {
        normalized[key.toLowerCase().trim()] = value;
      }

      const result = excelRowSchema.safeParse(normalized);

      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({
            field: issue.path.join("."),
            message: issue.message,
            row: i + 2,
          });
        }
      } else {
        validRows.push({
          age: result.data.age,
          email: result.data.email.toLowerCase().trim(),
          firstName: result.data.name,
          lastName: result.data.surname,
          password: result.data.password,
        });
      }
    }

    const emailSet = new Set<string>();
    const internalDuplicates: BulkUploadError[] = [];

    for (let i = 0; i < validRows.length; i++) {
      const email = validRows[i].email;
      if (emailSet.has(email)) {
        internalDuplicates.push({
          field: "email",
          message: `Duplicate email in file: ${email}`,
          row: i + 2,
        });
      }
      emailSet.add(email);
    }

    if (internalDuplicates.length > 0) {
      errors.push(...internalDuplicates);
    }

    const existingEmails = await prisma.user.findMany({
      select: { email: true },
      where: {
        email: {
          in: validRows.map((r) => r.email),
        },
      },
    });

    const existingEmailSet = new Set(existingEmails.map((u) => u.email));

    for (let i = 0; i < validRows.length; i++) {
      if (existingEmailSet.has(validRows[i].email)) {
        errors.push({
          field: "email",
          message: `Email already exists in database: ${validRows[i].email}`,
          row: i + 2,
        });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { errors, message: "Validation failed", success: false },
        { status: 400 }
      );
    }

    const usersToCreate = await Promise.all(
      validRows.map(async (row) => ({
        age: row.age,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        password: await bcrypt.hash(row.password, 10),
      }))
    );

    const result = await prisma.$transaction(
      usersToCreate.map((data) =>
        prisma.user.create({
          data,
          select: {
            age: true,
            email: true,
            firstName: true,
            id: true,
            lastName: true,
          },
        })
      )
    );

    return NextResponse.json(
      { count: result.length, message: `Successfully created ${result.length} users`, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
