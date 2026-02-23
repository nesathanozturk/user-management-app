"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Input from "@/components/ui/Input";
import { createUserSchema } from "@/lib/validations";
import type { CreateUserInput } from "@/lib/validations";

interface UserFormProps {
  error?: string | null;
  isPending: boolean;
  onSubmit: (data: CreateUserInput) => void;
}

const UserForm = ({ error, isPending, onSubmit }: UserFormProps) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          error={errors.firstName?.message}
          label="First Name"
          placeholder="John"
          {...register("firstName")}
        />

        <Input
          error={errors.lastName?.message}
          label="Last Name"
          placeholder="Doe"
          {...register("lastName")}
        />
      </div>

      <Input
        error={errors.email?.message}
        label="Email"
        placeholder="john@example.com"
        type="email"
        {...register("email")}
      />

      <Input
        error={errors.age?.message}
        label="Age"
        min="1"
        placeholder="25"
        type="number"
        {...register("age", { valueAsNumber: true })}
      />

      <Input
        error={errors.password?.message}
        label="Password"
        placeholder="Min 6 characters"
        type="password"
        {...register("password")}
      />

      <Button
        className="w-full"
        isLoading={isPending}
        size="lg"
        type="submit"
      >
        Create User
      </Button>
    </form>
  );
};

export default UserForm;
