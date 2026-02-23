"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  size?: "lg" | "md" | "sm";
  variant?: "danger" | "outline" | "primary" | "secondary";
}

const VARIANT_CLASSES: Record<string, string> = {
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50",
  primary: "bg-gray-900 text-white hover:bg-gray-800",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
};

const SIZE_CLASSES: Record<string, string> = {
  lg: "px-5 py-2.5 text-base",
  md: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-sm",
};

const Button = ({
  children,
  className,
  disabled,
  isLoading = false,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        (disabled || isLoading) && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            fill="currentColor"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
