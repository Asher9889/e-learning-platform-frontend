import { Clock, GraduationCap, IndianRupee, ArrowRight, ImageIcon } from "lucide-react";
import type { Program } from "../types/program.types";

interface ProgramCardProps {
  program: Program;
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

const modeLabels: Record<string, string> = {
  Online: "🌐 online",
  Offline: "🏫 offline",
  Hybrid: "🔄 hybrid",
};

export function ProgramCard({ program, onViewDetails, onApplyNow }: ProgramCardProps) {
  return (
    <div
      className="product-card"
      style={{
        padding: 0,
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.1) 0px 8px 32px 0px";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          aspectRatio: "16/9",
          overflow: "hidden",
          background: "var(--color-dew-drop)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {program.thumbnail ? (
          <img
            src={program.thumbnail}
            alt={program.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <ImageIcon
              size={32}
              style={{ color: "var(--color-charcoal)", opacity: 0.2 }}
            />
            <p
              style={{
                fontFamily: "var(--font-geist)",
                fontSize: 11,
                color: "var(--color-charcoal)",
                opacity: 0.3,
                marginTop: 4,
                textTransform: "lowercase",
              }}
            >
              {program.category}
            </p>
          </div>
        )}
        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 12,
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
          }}
        >
          {program.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <h3
          style={{
            fontFamily: "var(--font-gelica)",
            fontSize: 20,
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
            fontSize: 13,
            lineHeight: 1.5,
            color: "var(--color-charcoal)",
            marginBottom: 18,
            opacity: 0.7,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {program.description}
        </p>

        {/* Info rows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-geist)",
              fontSize: 12,
              color: "var(--color-charcoal)",
              textTransform: "lowercase",
            }}
          >
            <Clock size={14} style={{ opacity: 0.5 }} />
            {program.duration}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-geist)",
              fontSize: 12,
              color: "var(--color-charcoal)",
              textTransform: "lowercase",
            }}
          >
            {modeLabels[program.mode] || program.mode}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-geist)",
              fontSize: 12,
              color: "var(--color-charcoal)",
              gridColumn: "1 / -1",
              textTransform: "lowercase",
            }}
          >
            <GraduationCap size={14} style={{ opacity: 0.5 }} />
            {program.eligibility}
          </div>
        </div>

        {/* Fee */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 18,
          }}
        >
          <IndianRupee
            size={16}
            style={{ color: "var(--color-marker-orange)" }}
          />
          <span
            style={{
              fontFamily: "var(--font-gelica)",
              fontSize: 22,
              color: "var(--color-marker-orange)",
              textTransform: "lowercase",
            }}
          >
            {program.fee}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="pill-btn"
            onClick={() => onViewDetails(program.slug)}
            style={{
              flex: 1,
              padding: "8px 16px",
              fontSize: 13,
              fontFamily: "var(--font-gelica)",
            }}
          >
            view details
          </button>
          <button
            className="pill-btn"
            onClick={() => onApplyNow(program)}
            style={{
              flex: 1,
              padding: "8px 16px",
              fontSize: 13,
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
            apply now
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
