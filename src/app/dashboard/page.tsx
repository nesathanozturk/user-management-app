"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import AgeFilter from "@/components/AgeFilter";
import Pagination from "@/components/ui/Pagination";
import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import UserTable from "@/components/UserTable";
import { useUsers } from "@/hooks/useUsers";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const minAge = searchParams.get("minAge") || undefined;
  const maxAge = searchParams.get("maxAge") || undefined;

  const { data, error, isLoading } = useUsers({
    limit,
    maxAge: maxAge ? Number(maxAge) : undefined,
    minAge: minAge ? Number(minAge) : undefined,
    page,
  });

  const updateParams = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilter = (newMinAge?: string, newMaxAge?: string) => {
    updateParams({
      maxAge: newMaxAge,
      minAge: newMinAge,
      page: "1",
    });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your users here</p>
      </div>

      <AgeFilter
        initialMaxAge={maxAge || ""}
        initialMinAge={minAge || ""}
        onFilter={handleFilter}
      />

      {isLoading && (
        <div className="py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && <ErrorMessage message={error.message} />}

      {data && (
        <>
          <UserTable users={data.users} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              {Math.min((page - 1) * limit + 1, data.pagination.total)} to{" "}
              {Math.min(page * limit, data.pagination.total)} of{" "}
              {data.pagination.total} users
            </p>
            <Pagination
              currentPage={page}
              onPageChange={handlePageChange}
              totalPages={data.pagination.totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
