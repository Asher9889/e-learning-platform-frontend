import { useEffect, useRef } from "react";
import { CheckCircle2, Clock, GraduationCap, IndianRupee, X } from "lucide-react";
import { sileo } from "sileo";
import type { Program } from "../types/program.types";

interface ApplyNowModalProps {
  program: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyNowModal({ program, open, onOpenChange }: ApplyNowModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!program) return null;

  const handleStartAdmission = () => {
    onOpenChange(false);
    sileo.success({
      title: "Admission flow will be integrated soon.",
    });
  };

  if (!open) return null;

  return (
    <div
      className="superr"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(23, 23, 23, 0.5)",
        padding: 24,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="product-card"
        style={{
          maxWidth: 480,
          width: "100%",
          padding: 32,
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="pill-btn"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: 6,
            minWidth: 0,
            width: 32,
            height: 32,
            border: "1.5px solid var(--color-charcoal)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--surface-canvas)",
            cursor: "pointer",
          }}
        >
          <X size={14} />
        </button>

        {/* Header */}
        <h2
          style={{
            fontFamily: "var(--font-gelica)",
            fontSize: 22,
            color: "var(--color-cocoa-ink)",
            marginBottom: 4,
            textTransform: "lowercase",
            paddingRight: 32,
          }}
        >
          {program.name}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-geist)",
            fontSize: 13,
            color: "var(--color-charcoal)",
            opacity: 0.6,
            marginBottom: 20,
            textTransform: "lowercase",
          }}
        >
          review program details before starting your application.
        </p>

        {/* Details grid */}
        <div
          style={{
            border: "1.5px solid var(--color-charcoal)",
            borderRadius: "var(--radius-cards)",
            padding: 20,
            marginBottom: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IndianRupee size={16} style={{ opacity: 0.4 }} />
            <div>
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: 11,
                  opacity: 0.5,
                  margin: 0,
                  textTransform: "lowercase",
                }}
              >
                program fee
              </p>
              <p
                style={{
                  fontFamily: "var(--font-gelica)",
                  fontSize: 16,
                  color: "var(--color-marker-orange)",
                  margin: 0,
                  textTransform: "lowercase",
                }}
              >
                {program.fee}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={16} style={{ opacity: 0.4 }} />
            <div>
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: 11,
                  opacity: 0.5,
                  margin: 0,
                  textTransform: "lowercase",
                }}
              >
                duration
              </p>
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: 14,
                  color: "var(--color-charcoal)",
                  margin: 0,
                  textTransform: "lowercase",
                }}
              >
                {program.duration}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GraduationCap size={16} style={{ opacity: 0.4 }} />
            <div>
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: 11,
                  opacity: 0.5,
                  margin: 0,
                  textTransform: "lowercase",
                }}
              >
                mode
              </p>
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: 14,
                  color: "var(--color-charcoal)",
                  margin: 0,
                  textTransform: "lowercase",
                }}
              >
                {program.mode}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} style={{ opacity: 0.4 }} />
            <div>
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: 11,
                  opacity: 0.5,
                  margin: 0,
                  textTransform: "lowercase",
                }}
              >
                eligibility
              </p>
              <p
                style={{
                  fontFamily: "var(--font-geist)",
                  fontSize: 14,
                  color: "var(--color-charcoal)",
                  margin: 0,
                  textTransform: "lowercase",
                }}
              >
                {program.eligibility}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div
          style={{
            border: "1.5px solid var(--color-charcoal)",
            borderRadius: "var(--radius-cards)",
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h4
            style={{
              fontFamily: "var(--font-gelica)",
              fontSize: 16,
              color: "var(--color-cocoa-ink)",
              marginBottom: 12,
              textTransform: "lowercase",
            }}
          >
            benefits
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "industry-recognized certification",
              "expert faculty with real-world experience",
              "flexible learning schedules",
              "dedicated placement assistance",
            ].map((benefit) => (
              <div
                key={benefit}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontFamily: "var(--font-geist)",
                  fontSize: 13,
                  color: "var(--color-charcoal)",
                  opacity: 0.7,
                  textTransform: "lowercase",
                }}
              >
                <CheckCircle2
                  size={14}
                  className="marker-highlight"
                  style={{
                    color: "var(--color-marker-orange)",
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <button
          className="pill-btn"
          onClick={handleStartAdmission}
          style={{
            width: "100%",
            padding: "12px 24px",
            fontSize: 16,
            fontFamily: "var(--font-gelica)",
            background: "var(--color-marker-orange)",
            color: "#fff",
            borderColor: "var(--color-marker-orange)",
          }}
        >
          start admission process
        </button>
      </div>
    </div>
  );
}
