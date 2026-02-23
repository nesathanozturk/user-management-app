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

  const roleBadge =
    user.role === "admin" ? (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20">
        User
      </span>
    );

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
        <h1 className="text-2xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">User details</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <dl className="divide-y divide-gray-100">
          <div className="grid grid-cols-3 px-6 py-4">
            <dt className="text-sm text-gray-500">First Name</dt>
            <dd className="col-span-2 text-sm text-gray-900">{user.firstName}</dd>
          </div>
          <div className="grid grid-cols-3 px-6 py-4">
            <dt className="text-sm text-gray-500">Last Name</dt>
            <dd className="col-span-2 text-sm text-gray-900">{user.lastName}</dd>
          </div>
          <div className="grid grid-cols-3 px-6 py-4">
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="col-span-2 text-sm text-gray-900">{user.email}</dd>
          </div>
          <div className="grid grid-cols-3 px-6 py-4">
            <dt className="text-sm text-gray-500">Age</dt>
            <dd className="col-span-2 text-sm text-gray-900">{user.age}</dd>
          </div>
          <div className="grid grid-cols-3 px-6 py-4">
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="col-span-2">{roleBadge}</dd>
          </div>
          <div className="grid grid-cols-3 px-6 py-4">
            <dt className="text-sm text-gray-500">Created At</dt>
            <dd className="col-span-2 text-sm text-gray-900">{formatDate(user.createdAt)}</dd>
          </div>
          <div className="grid grid-cols-3 px-6 py-4">
            <dt className="text-sm text-gray-500">Updated At</dt>
            <dd className="col-span-2 text-sm text-gray-900">{formatDate(user.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
