import { BookOpen, Users, Award, HeadphonesIcon } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "32",
    label: "programs",
    desc: "diverse programs offered",
  },
  {
    icon: Users,
    value: "8,500+",
    label: "active students",
    desc: "currently enrolled learners",
  },
  {
    icon: Award,
    value: "120+",
    label: "expert faculty",
    desc: "industry-experienced mentors",
  },
  {
    icon: HeadphonesIcon,
    value: "24/7",
    label: "placement support",
    desc: "dedicated career assistance",
  },
];

export function ProgramStats() {
  return (
    <section
      className="superr"
      style={{ padding: "0 24px 64px" }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
          position: "relative",
        }}
      >
        {/* Sticker */}
        <div
          className="sticker"
          style={{
            position: "absolute",
            top: -20,
            right: "10%",
            transform: "rotate(15deg)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle
              cx="14"
              cy="14"
              r="12"
              fill="#22c55e"
              stroke="#171717"
              strokeWidth="2"
            />
          </svg>
        </div>

        {stats.map((s) => (
          <div
            key={s.label}
            className="product-card"
            style={{
              padding: 28,
              textAlign: "center",
              transition: "transform 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "1.5px solid var(--color-charcoal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <s.icon
                size={20}
                style={{ color: "var(--color-marker-orange)" }}
              />
            </div>
            <div
              style={{
                fontFamily: "var(--font-gelica)",
                fontSize: 32,
                fontWeight: 400,
                color: "var(--color-cocoa-ink)",
                lineHeight: 1.08,
                marginBottom: 4,
                textTransform: "lowercase",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-charcoal)",
                textTransform: "lowercase",
                marginBottom: 2,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist)",
                fontSize: 12,
                color: "var(--color-charcoal)",
                opacity: 0.6,
                textTransform: "lowercase",
              }}
            >
              {s.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
