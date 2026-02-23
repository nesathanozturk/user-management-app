"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import UserForm from "@/components/UserForm";
import { useCreateUser } from "@/hooks/useUsers";
import type { CreateUserInput } from "@/lib/validations";

export default function AddUserPage() {
  const router = useRouter();
  const { error, isPending, mutate: createUser } = useCreateUser();

  const handleSubmit = (data: CreateUserInput) => {
    createUser(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          href="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add User</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new user account
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <UserForm
          error={error?.message}
          isPending={isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
