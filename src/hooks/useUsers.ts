"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateUserRequest, User, UsersResponse, UserQueryParams } from "@/types";

export function useUsers(params: UserQueryParams) {
  return useQuery({
    queryFn: async (): Promise<UsersResponse> => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.minAge) searchParams.set("minAge", String(params.minAge));
      if (params.maxAge) searchParams.set("maxAge", String(params.maxAge));

      const res = await fetch(`/api/users?${searchParams.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to fetch users");
      }
      return res.json();
    },
    queryKey: ["users", params.page, params.limit, params.minAge, params.maxAge],
  });
}

export function useUser(userId: string) {
  return useQuery({
    enabled: !!userId,
    queryFn: async (): Promise<{ user: User }> => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to fetch user");
      }
      return res.json();
    },
    queryKey: ["user", userId],
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const res = await fetch("/api/users", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
