const MODULES = [
  {
    emoji: '📚',
    title: 'course management',
    desc: 'create courses with videos, pdfs, slides, and structured modules. organize by semester, batch, or category.',
  },
  {
    emoji: '🎥',
    title: 'live virtual classroom',
    desc: 'hd video lectures with screen sharing, interactive q&a, chat, hand-raising, and session recording.',
  },
  {
    emoji: '📝',
    title: 'assessments & exams',
    desc: 'quizzes, timed tests, assignments with auto-grading, plagiarism check, and instant results.',
  },
  {
    emoji: '📊',
    title: 'smart dashboard',
    desc: 'real-time progress tracking, engagement metrics, attendance reports, and learning analytics.',
  },
  {
    emoji: '🔐',
    title: 'role-based access',
    desc: 'separate portals for students, teachers, admins, and parents — each with tailored views.',
  },
  {
    emoji: '🎓',
    title: 'certificate engine',
    desc: 'auto-generate branded certificates on course completion with unique verification codes.',
  },
  {
    emoji: '📱',
    title: 'offline-first content',
    desc: 'download materials and watch recorded lectures offline. sync progress when back online.',
  },
  {
    emoji: '🧠',
    title: 'ai recommendations',
    desc: 'smart course suggestions based on performance, learning pace, and past behavior.',
  },
  {
    emoji: '🏷️',
    title: 'white-label portal',
    desc: 'your institution\'s brand, logo, domain, and colors — not ours. full white-label experience.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="superr" style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ marginBottom: 48, maxWidth: 500, position: 'relative' }}>
          <div className="handwritten-caption" style={{ marginBottom: 8 }}>
            everything you need
          </div>
          <h2 className="display-headline" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', margin: 0, marginBottom: 12 }}>
            one platform,<br />infinite possibilities
          </h2>
          <p style={{ fontFamily: 'var(--font-geist)', fontSize: 16, lineHeight: 1.6, color: 'var(--color-charcoal)' }}>
            from enrollment to certification — every tool an institution needs to deliver world-class education.
          </p>

          {/* Sticker */}
          <div className="sticker" style={{ position: 'absolute', top: -10, right: -20, transform: 'rotate(-10deg)' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 0L23 10L34 11L26 19L28 30L18 25L8 30L10 19L2 11L13 10L18 0Z" fill="#ff66cf" stroke="#171717" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {MODULES.map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="product-card"
              style={{ padding: 28, transition: 'transform 0.25s ease, box-shadow 0.25s ease', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 8px 32px 0px'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 14, lineHeight: 1 }}>{emoji}</div>
              <h3 style={{
                fontFamily: 'var(--font-gelica)',
                fontSize: 20,
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
