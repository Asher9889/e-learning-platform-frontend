import type { Program } from "../types/program.types";
import { ProgramCard } from "./ProgramCard";
import { EmptyPrograms } from "./EmptyPrograms";

interface ProgramGridProps {
  programs: Program[];
  onViewDetails: (slug: string) => void;
  onApplyNow: (program: Program) => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

function SkeletonCard() {
  return (
    <div
      className="product-card"
      style={{
        padding: 0,
        overflow: "hidden",
        background: "var(--surface-canvas)",
      }}
    >
      <div
        style={{
          aspectRatio: "16/9",
          background: "var(--color-dew-drop)",
        }}
      />
      <div style={{ padding: 24 }}>
        <div
          style={{
            height: 20,
            width: "70%",
            background: "var(--color-dew-drop)",
            borderRadius: 4,
            marginBottom: 12,
          }}
        />
        <div
          style={{
            height: 12,
            width: "100%",
            background: "var(--color-dew-drop)",
            borderRadius: 4,
            marginBottom: 6,
          }}
        />
        <div
          style={{
            height: 12,
            width: "80%",
            background: "var(--color-dew-drop)",
            borderRadius: 4,
            marginBottom: 18,
          }}
        />
        <div
          style={{
            height: 14,
            width: "40%",
            background: "var(--color-dew-drop)",
            borderRadius: 4,
            marginBottom: 18,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 36,
              background: "var(--color-dew-drop)",
              borderRadius: "var(--radius-buttons)",
            }}
          />
          <div
            style={{
              flex: 1,
              height: 36,
              background: "var(--color-dew-drop)",
              borderRadius: "var(--radius-buttons)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function ProgramGrid({
  programs,
  onViewDetails,
  onApplyNow,
  onResetFilters,
  isLoading,
}: ProgramGridProps) {
  if (isLoading) {
    return (
      <section className="superr" style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (programs.length === 0) {
    return <EmptyPrograms onResetFilters={onResetFilters} />;
  }

  return (
    <section className="superr" style={{ padding: "0 24px 64px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 28, position: "relative" }}>
          <h2
            className="display-headline"
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
              margin: "0 0 4px",
              textTransform: "lowercase",
            }}
          >
            all programs
          </h2>
          <p
            style={{
              fontFamily: "var(--font-geist)",
              fontSize: 13,
              color: "var(--color-charcoal)",
              opacity: 0.6,
              textTransform: "lowercase",
            }}
          >
            showing {programs.length} program{programs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onViewDetails={onViewDetails}
              onApplyNow={onApplyNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
