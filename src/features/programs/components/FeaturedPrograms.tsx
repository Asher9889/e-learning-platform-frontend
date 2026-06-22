import { Star, ArrowRight } from "lucide-react";
import type { Program } from "../types/program.types";

interface FeaturedProgramsProps {
  programs: Program[];
  onViewDetails: (slug: string) => void;
  onApplyNow: (program: Program) => void;
}

const categoryColors: Record<string, string> = {
  School: "#3b82f6",
  Diploma: "#22c55e",
  Undergraduate: "#a855f7",
  Postgraduate: "#f97316",
  Professional: "#e11d48",
};

export function FeaturedPrograms({
  programs,
  onViewDetails,
  onApplyNow,
}: FeaturedProgramsProps) {
  if (programs.length === 0) return null;

  return (
    <section className="superr" style={{ padding: "0 24px 64px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ marginBottom: 32, position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <Star
              size={18}
              style={{
                fill: "var(--color-marker-orange)",
                color: "var(--color-marker-orange)",
              }}
            />
            <h2
              className="display-headline"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                margin: 0,
                textTransform: "lowercase",
              }}
            >
              featured programs
            </h2>
          </div>
          <p
            style={{
              fontFamily: "var(--font-geist)",
              fontSize: 14,
              color: "var(--color-charcoal)",
              textTransform: "lowercase",
            }}
          >
            most popular programs among students.
          </p>
        </div>

        {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {programs.slice(0, 4).map((program) => (
            <div
              key={program.id}
              className="product-card"
              style={{
                padding: 24,
                transition: "transform 0.25s ease",
                cursor: "default",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              {/* Category badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 10px",
                  borderRadius: "var(--radius-tags)",
                  fontFamily: "var(--font-geist)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#fff",
                  background: categoryColors[program.category] || "#666",
                  textTransform: "lowercase",
                  marginBottom: 12,
                }}
              >
                {program.category}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-gelica)",
                  fontSize: 18,
                  fontWeight: 400,
                  color: "var(--color-cocoa-ink)",
                  marginBottom: 8,
                  textTransform: "lowercase",
                  lineHeight: 1.25,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {program.name}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: "var(--color-charcoal)",
                  marginBottom: 14,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  opacity: 0.7,
                }}
              >
                {program.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-gelica)",
                    fontSize: 18,
                    color: "var(--color-marker-orange)",
                    textTransform: "lowercase",
                  }}
                >
                  {program.fee}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-geist)",
                    fontSize: 11,
                    color: "var(--color-charcoal)",
                    opacity: 0.6,
                    textTransform: "lowercase",
                  }}
                >
                  {program.duration}
                </span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="pill-btn"
                  onClick={() => onViewDetails(program.slug)}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontFamily: "var(--font-gelica)",
                  }}
                >
                  details
                </button>
                <button
                  className="pill-btn"
                  onClick={() => onApplyNow(program)}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontFamily: "var(--font-gelica)",
                    background: "var(--color-marker-orange)",
                    color: "#fff",
                    borderColor: "var(--color-marker-orange)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  apply
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
