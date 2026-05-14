"use client";

import { Search } from "lucide-react";

interface FilterBarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: { value: string; label: string }[];
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
  onClear?: () => void;
  showClear?: boolean;
}

const selectStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid var(--border)",
  background: "var(--surface-strong)",
  fontSize: 13,
  color: "var(--ink)",
  cursor: "pointer",
  outline: "none",
};

export default function FilterBar({
  search,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions,
  statusValue,
  onStatusChange,
  statusOptions,
  onClear,
  showClear,
}: FilterBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 16,
      }}
    >
      {onSearchChange !== undefined && (
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: 180,
            maxWidth: 320,
          }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-muted)",
            }}
          />
          <input
            type="text"
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            aria-label="Search"
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "var(--surface-strong)",
              fontSize: 13,
              outline: "none",
              color: "var(--ink)",
            }}
          />
        </div>
      )}

      {statusOptions && statusOptions.length > 0 && onStatusChange && (
        <select
          value={statusValue ?? ""}
          onChange={(e) => onStatusChange(e.target.value)}
          style={selectStyle}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      )}

      {sortOptions && sortOptions.length > 0 && onSortChange && (
        <select
          value={sortValue ?? ""}
          onChange={(e) => onSortChange(e.target.value)}
          style={selectStyle}
          aria-label="Sort by"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      )}

      {showClear && onClear && (
        <button
          onClick={onClear}
          style={{
            padding: "7px 12px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "none",
            fontSize: 12,
            color: "var(--ink-muted)",
            cursor: "pointer",
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
