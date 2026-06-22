import { Search, RotateCcw } from "lucide-react";

const programTypes = [
  "All Programs",
  "School",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
  "Professional Certification",
];

const durations = [
  "All",
  "3 Months",
  "6 Months",
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
];

const sortOptions = [
  "Newest",
  "Popular",
  "Lowest Fee",
  "Highest Fee",
  "A-Z",
];

interface ProgramFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  durationFilter: string;
  onDurationChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

const controlBase: React.CSSProperties = {
  fontFamily: "var(--font-geist)",
  fontSize: 13,
  border: "1.5px solid var(--color-charcoal)",
  borderRadius: "var(--radius-inputs)",
  background: "var(--surface-canvas)",
  color: "var(--color-charcoal)",
  textTransform: "lowercase",
  outline: "none",
  height: 38,
  boxSizing: "border-box",
};

export function ProgramFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  durationFilter,
  onDurationChange,
  sortBy,
  onSortChange,
  onReset,
}: ProgramFiltersProps) {
  return (
    <div
      className="superr"
      style={{
        position: "sticky",
        top: 64,
        zIndex: 30,
        borderBottom: "1px solid var(--color-charcoal)",
        background: "var(--surface-canvas)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "0 1 260px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-charcoal)",
              opacity: 0.5,
            }}
          />
          <input
            placeholder="search programs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              ...controlBase,
              width: "100%",
              padding: "6px 10px 6px 30px",
            }}
          />
        </div>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{ ...controlBase, flex: "0 0 auto", padding: "6px 10px", maxWidth: 160 }}
        >
          {programTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Duration */}
        <select
          value={durationFilter}
          onChange={(e) => onDurationChange(e.target.value)}
          style={{ ...controlBase, flex: "0 0 auto", padding: "6px 10px", maxWidth: 110 }}
        >
          {durations.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{ ...controlBase, flex: "0 0 auto", padding: "6px 10px", maxWidth: 120 }}
        >
          {sortOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          className="pill-btn"
          onClick={onReset}
          style={{
            width: 38,
            height: 38,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          title="Reset Filters"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}
