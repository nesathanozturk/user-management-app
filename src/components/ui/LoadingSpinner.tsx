import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "lg" | "md" | "sm";
}

const SIZE_MAP: Record<string, string> = {
  lg: "h-10 w-10",
  md: "h-6 w-6",
  sm: "h-4 w-4",
};

const LoadingSpinner = ({ size = "md" }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-200 border-t-gray-900",
          SIZE_MAP[size]
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
