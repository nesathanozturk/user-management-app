"use client";

import { Eye } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/lib/utils";
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
        <p className="text-sm text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
              First Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
              Last Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
              Age
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
              Created At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr className="transition-colors hover:bg-gray-50" key={user.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {user.firstName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {user.lastName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.age}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {user.role === "admin" ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20">
                    User
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <Link
                  className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
                  href={`/dashboard/${user.id}`}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
