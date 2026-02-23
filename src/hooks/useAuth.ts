"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { LoginRequest, LoginResponse } from "@/types";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const res = await fetch("/api/auth/login", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}
