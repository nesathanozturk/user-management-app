"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validations";
import type { LoginInput } from "@/lib/validations";

const LoginForm = () => {
  const { toast } = useToast();
  const { mutate: login, error, isPending } = useLogin();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onError: (err) => {
        toast(err.message || "Login failed");
      },
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorMessage message={error.message} />}

      <Input
        error={errors.email?.message}
        label="Email"
        placeholder="admin@admin.com"
        type="email"
        {...register("email")}
      />

      <Input
        error={errors.password?.message}
        label="Password"
        placeholder="Enter your password"
        type="password"
        {...register("password")}
      />

      <Button
        className="w-full"
        isLoading={isPending}
        size="lg"
        type="submit"
      >
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;
