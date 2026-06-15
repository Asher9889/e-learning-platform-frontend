const DIFFERENTIATORS = [
  {
    title: 'white-label for every institution',
    desc: 'your brand, your domain, your colors. we vanish into the background — your institution owns the experience.',
    tag: 'brand-first',
  },
  {
    title: 'hybrid learning engine',
    desc: 'live classes + recorded content + uploaded materials in one unified timeline. students never miss a beat.',
    tag: 'flexible',
  },
  {
    title: 'batch & group management',
    desc: 'coaching institutes can create multiple batches with independent curricula, schedules, and faculty assignments.',
    tag: 'scalable',
  },
  {
    title: 'parent & guardian portal',
    desc: 'parents get real-time access to attendance, grades, progress reports, and class recordings.',
    tag: 'transparent',
  },
  {
    title: 'custom curriculum designer',
    desc: 'drag-and-drop curriculum builder for universities to design semester programs, credit systems, and prerequisites.',
    tag: 'powerful',
  },
  {
    title: 'api-first architecture',
    desc: 'integrate with your existing erp, lms, or student information system. we fit into your workflow.',
    tag: 'developer-friendly',
  },
];

export function DifferentiatorsSection() {
  return (
    <section id="why-us" className="superr" style={{ padding: '0 24px 80px', background: 'var(--color-dew-drop)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ marginBottom: 48, maxWidth: 560, position: 'relative' }}>
          <div className="handwritten-caption" style={{ marginBottom: 8 }}>
            not just another lms
          </div>
          <h2 className="display-headline" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', margin: 0, marginBottom: 12 }}>
            built differently.<br />on purpose.
          </h2>
          <p style={{ fontFamily: 'var(--font-geist)', fontSize: 16, lineHeight: 1.6, color: 'var(--color-charcoal)' }}>
            udemy has courses. skillshare has creativity. we have{' '}
            <span className="marker-highlight">institutional infrastructure</span> — purpose-built for universities
            and coaching centers that need control, scale, and personalization.
          </p>

          {/* Sticker */}
          <div className="sticker" style={{ position: 'absolute', top: -15, right: -10, transform: 'rotate(8deg)' }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <rect x="3" y="3" width="32" height="32" rx="8" fill="#3b82f6" stroke="#171717" strokeWidth="2" />
              <path d="M12 19L17 24L26 14" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Differentiators Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {DIFFERENTIATORS.map(({ title, desc, tag }) => (
            <div
              key={title}
              className="product-card"
              style={{
                padding: 28,
                background: 'var(--surface-canvas)',
                transition: 'transform 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', background: 'var(--color-marker-orange)',
                  flexShrink: 0,
                }} />
                <div className="tag" style={{
                  border: '1.5px solid var(--color-sky-sticker)',
                  borderRadius: 'var(--radius-tags)',
                  padding: '3px 12px',
                  fontFamily: 'var(--font-geist)',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--color-charcoal)',
                  textTransform: 'lowercase',
                }}>
                  {tag}
                </div>
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
