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
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              First Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Last Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Age
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
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
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <Link
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
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
