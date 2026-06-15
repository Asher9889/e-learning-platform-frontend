const STATS = [
  { num: '50+', label: 'institutions onboarded' },
  { num: '10,000+', label: 'active learners' },
  { num: '500+', label: 'live classes daily' },
  { num: '99.9%', label: 'platform uptime' },
];

export function StatsSection() {
  return (
    <section className="superr" style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
        {/* Sticker decoration */}
        <div className="sticker" style={{ position: 'absolute', top: -20, right: '15%', transform: 'rotate(15deg)' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="4" fill="#22c55e" stroke="#171717" strokeWidth="2" />
            <path d="M10 16L14 20L22 12" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {STATS.map(({ num, label }) => (
          <div
            key={label}
            style={{
              border: '1.5px solid var(--color-charcoal)',
              borderRadius: 'var(--radius-cards)',
              padding: '28px 24px',
              background: 'var(--surface-canvas)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-gelica)',
              fontSize: 36,
              fontWeight: 400,
              color: 'var(--color-cocoa-ink)',
              lineHeight: 1.08,
              marginBottom: 6,
              textTransform: 'lowercase',
            }}>
              {num}
            </div>
            <div style={{
              fontFamily: 'var(--font-geist)',
              fontSize: 14,
              color: 'var(--color-charcoal)',
              textTransform: 'lowercase',
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
