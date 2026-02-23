import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  age: z
    .number({ error: "Please enter a valid age" })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(150, "Age must be at most 150"),
  email: z.email("Please enter a valid email"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createUserApiSchema = z.object({
  age: z.coerce
    .number()
    .int()
    .min(1, "Age must be at least 1")
    .max(150, "Age must be at most 150"),
  email: z.email("Please enter a valid email"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const excelRowSchema = z.object({
  age: z.coerce.number().int().positive("Age must be a positive integer"),
  email: z.email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  password: z.coerce.string().min(1, "Password is required"),
  surname: z.string().min(1, "Surname is required"),
});

export const userQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  maxAge: z.coerce.number().int().positive().optional(),
  minAge: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ExcelRowInput = z.infer<typeof excelRowSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
