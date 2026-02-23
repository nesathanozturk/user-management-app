"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRef, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

interface AgeFilterProps {
  initialMaxAge?: string;
  initialMinAge?: string;
  onFilter: (minAge?: string, maxAge?: string) => void;
}

const AgeFilter = ({ initialMaxAge = "", initialMinAge = "", onFilter }: AgeFilterProps) => {
  const [maxAge, setMaxAge] = useState(initialMaxAge);
  const [minAge, setMinAge] = useState(initialMinAge);
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFilter = () => {
    const minBadInput = minRef.current?.validity.badInput;
    const maxBadInput = maxRef.current?.validity.badInput;

    if (minBadInput || maxBadInput) {
      toast("Please enter a valid number for age");
      return;
    }

    const min = minAge ? Number(minAge) : undefined;
    const max = maxAge ? Number(maxAge) : undefined;

    if (min !== undefined && min < 1) {
      toast("Min age must be greater than 0");
      return;
    }
    if (max !== undefined && max < 1) {
      toast("Max age must be greater than 0");
      return;
    }
    if (min !== undefined && max !== undefined && min > max) {
      toast("Min age cannot be greater than max age");
      return;
    }

    onFilter(minAge || undefined, maxAge || undefined);
  };

  const handleClear = () => {
    setMaxAge("");
    setMinAge("");
    onFilter(undefined, undefined);
  };

  return (
    <div className="flex items-end gap-2">
      <div className="w-24">
        <label className="mb-1 block text-xs font-medium text-gray-900">Min Age</label>
        <Input
          className="bg-white px-2.5 py-1.5 text-xs"
          min="1"
          onChange={(e) => setMinAge(e.target.value)}
          placeholder="Min"
          ref={minRef}
          type="number"
          value={minAge}
        />
      </div>
      <div className="w-24">
        <label className="mb-1 block text-xs font-medium text-gray-900">Max Age</label>
        <Input
          className="bg-white px-2.5 py-1.5 text-xs"
          min="1"
          onChange={(e) => setMaxAge(e.target.value)}
          placeholder="Max"
          ref={maxRef}
          type="number"
          value={maxAge}
        />
      </div>
      <Button onClick={handleFilter} size="sm" variant="secondary">
        <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
        Filters
      </Button>
      {(minAge || maxAge) && (
        <Button onClick={handleClear} size="sm" variant="outline">
          <X className="mr-1.5 h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default AgeFilter;
