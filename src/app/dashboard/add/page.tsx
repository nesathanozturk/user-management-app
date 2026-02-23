"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import UserForm from "@/components/UserForm";
import { useToast } from "@/components/ui/Toast";
import { useCreateUser } from "@/hooks/useUsers";
import type { CreateUserInput } from "@/lib/validations";

export default function AddUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { error, isPending, mutate: createUser } = useCreateUser();

  const handleSubmit = (data: CreateUserInput) => {
    createUser(data, {
      onError: (err) => {
        toast(err.message || "Failed to create user");
      },
      onSuccess: () => {
        toast("User created successfully", "success");
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="space-y-6">
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
