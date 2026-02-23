"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface AgeFilterProps {
  initialMaxAge?: string;
  initialMinAge?: string;
  onFilter: (minAge?: string, maxAge?: string) => void;
}

const AgeFilter = ({ initialMaxAge = "", initialMinAge = "", onFilter }: AgeFilterProps) => {
  const [maxAge, setMaxAge] = useState(initialMaxAge);
  const [minAge, setMinAge] = useState(initialMinAge);

  const handleFilter = () => {
    onFilter(minAge || undefined, maxAge || undefined);
  };

  const handleClear = () => {
    setMaxAge("");
    setMinAge("");
    onFilter(undefined, undefined);
  };

  return (
    <div className="flex items-end gap-3">
      <div className="w-32">
        <Input
          label="Min Age"
          min="1"
          onChange={(e) => setMinAge(e.target.value)}
          placeholder="Min"
          type="number"
          value={minAge}
        />
      </div>
      <div className="w-32">
        <Input
          label="Max Age"
          min="1"
          onChange={(e) => setMaxAge(e.target.value)}
          placeholder="Max"
          type="number"
          value={maxAge}
        />
      </div>
      <Button onClick={handleFilter} size="md" variant="secondary">
        Filter
      </Button>
      {(minAge || maxAge) && (
        <Button onClick={handleClear} size="md" variant="outline">
          Clear
        </Button>
      )}
    </div>
  );
};

export default AgeFilter;
