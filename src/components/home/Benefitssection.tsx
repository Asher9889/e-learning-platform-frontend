const BENEFITS = [
  {
    num: '01',
    title: 'for universities',
    desc: 'semester-based curriculum, credit management, multiple departments, faculty dashboards, and accredited certificate generation.',
  },
  {
    num: '02',
    title: 'for coaching institutes',
    desc: 'batch management, multi-branch support, flexible scheduling, parent access, and competitive exam mock tests.',
  },
  {
    num: '03',
    title: 'for teachers',
    desc: 'one-click live classes, content library, auto-graded assessments, student performance analytics, and easy communication tools.',
  },
  {
    num: '04',
    title: 'for students',
    desc: 'personalized learning dashboard, offline access, progress tracking, doubt resolution, and a mobile-first experience.',
  },
];

export function BenefitsSection() {
  return (
    <section className="superr" style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ marginBottom: 48, maxWidth: 500, position: 'relative' }}>
          <div className="handwritten-caption" style={{ marginBottom: 8 }}>
            benefits for everyone
          </div>
          <h2 className="display-headline" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', margin: 0, marginBottom: 12 }}>
            designed for every<br />role in education
          </h2>
          <p style={{ fontFamily: 'var(--font-geist)', fontSize: 16, lineHeight: 1.6, color: 'var(--color-charcoal)' }}>
            whether you run a university, a coaching center, or teach a class — our platform adapts to you.
          </p>

          <div className="sticker" style={{ position: 'absolute', top: -5, right: -10, transform: 'rotate(12deg)' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 0L21 10L32 12L24 21L26 32L16 26L6 32L8 21L0 12L11 10L16 0Z" fill="#ff66cf" stroke="#171717" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Benefits Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20 }}>
          {BENEFITS.map(({ num, title, desc }) => (
            <div
              key={title}
              className="product-card"
              style={{
                padding: 28,
                transition: 'transform 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              <div style={{
                fontFamily: 'var(--font-gelica)',
                fontSize: 14,
                color: 'var(--color-marker-orange)',
                marginBottom: 10,
                textTransform: 'lowercase',
              }}>
                {num}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-gelica)',
                fontSize: 22,
                fontWeight: 400,
                color: 'var(--color-cocoa-ink)',
                marginBottom: 8,
                textTransform: 'lowercase',
              }}>
                {title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-geist)',
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--color-charcoal)',
                margin: 0,
              }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
