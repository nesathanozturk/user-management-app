"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

const Pagination = ({ currentPage, onPageChange, totalPages }: PaginationProps) => {
  if (totalPages <= 1) return null;

  function getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center gap-1">
      <button
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pageNumbers.map((page, index) =>
        typeof page === "string" ? (
          <span className="px-2 text-sm text-gray-400" key={`ellipsis-${index}`}>
            {page}
          </span>
        ) : (
          <button
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors",
              page === currentPage
                ? "bg-gray-900 font-medium text-white"
                : "text-gray-600 hover:bg-gray-50"
            )}
            key={page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
      <button
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
