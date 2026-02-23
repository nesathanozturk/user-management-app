"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, onDrop, onKeyDown, onPaste, type, ...props }, ref) => {
    const isNumber = type === "number";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isNumber && ["e", "E", "+", "-", "."].includes(e.key)) {
        e.preventDefault();
      }
      onKeyDown?.(e);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (isNumber) {
        const pasted = e.clipboardData.getData("text");
        if (!/^\d+$/.test(pasted)) {
          e.preventDefault();
        }
      }
      onPaste?.(e);
    };

    const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
      if (isNumber) {
        e.preventDefault();
      }
      onDrop?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          className={cn(
            "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          ref={ref}
          type={type}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
