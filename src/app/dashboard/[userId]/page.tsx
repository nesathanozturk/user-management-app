"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useUser } from "@/hooks/useUsers";
import { formatDate } from "@/lib/utils";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data, error, isLoading } = useUser(userId);

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          href="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  if (!data?.user) return null;

  const { user } = data;

  const fields = [
    { label: "First Name", value: user.firstName },
    { label: "Last Name", value: user.lastName },
    { label: "Email", value: user.email },
    { label: "Age", value: String(user.age) },
    { label: "Role", value: user.role },
    { label: "Created At", value: formatDate(user.createdAt) },
    { label: "Updated At", value: formatDate(user.updatedAt) },
  ];

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
        <h1 className="text-2xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">User details</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-sm font-medium text-gray-500">
                {field.label}
              </dt>
              <dd className="mt-1 text-base text-gray-900">{field.value}</dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
