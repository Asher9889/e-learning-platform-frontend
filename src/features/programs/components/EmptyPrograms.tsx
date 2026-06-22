import { SearchX, RotateCcw } from "lucide-react";

interface EmptyProgramsProps {
  onResetFilters: () => void;
}

export function EmptyPrograms({ onResetFilters }: EmptyProgramsProps) {
  return (
    <section className="superr" style={{ padding: "0 24px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="product-card"
          style={{
            padding: "56px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "1.5px solid var(--color-charcoal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              opacity: 0.4,
            }}
          >
            <SearchX size={24} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-gelica)",
              fontSize: 22,
              color: "var(--color-cocoa-ink)",
              marginBottom: 8,
              textTransform: "lowercase",
            }}
          >
            no programs found
          </h2>
          <p
            style={{
              fontFamily: "var(--font-geist)",
              fontSize: 14,
              color: "var(--color-charcoal)",
              marginBottom: 24,
              textTransform: "lowercase",
              opacity: 0.6,
            }}
          >
            try adjusting your filters or search criteria.
          </p>
          <button
            className="pill-btn"
            onClick={onResetFilters}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              margin: "0 auto",
            }}
          >
            <RotateCcw size={14} />
            reset filters
          </button>
        </div>
      </div>
    </section>
  );
}
