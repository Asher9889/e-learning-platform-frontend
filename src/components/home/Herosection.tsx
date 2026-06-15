interface HeroSectionProps {
  scrollTo: (id: string) => void;
}

export function HeroSection({ scrollTo }: HeroSectionProps) {
  return (
    <section className="superr" style={{ padding: '80px 24px 64px', position: 'relative', overflow: 'hidden' }}>
      {/* Sticker decorations */}
      <div className="sticker" style={{ position: 'absolute', top: 40, right: '12%', transform: 'rotate(12deg)' }}>
        <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
          <path d="M20 0L26 18L40 20L28 32L32 52L20 42L8 52L12 32L0 20L14 18L20 0Z" fill="#3b82f6" stroke="#171717" strokeWidth="2" />
        </svg>
      </div>
      <div className="sticker" style={{ position: 'absolute', bottom: 40, left: '8%', transform: 'rotate(-8deg)' }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="20" fill="#ff66cf" stroke="#171717" strokeWidth="2" />
          <circle cx="14" cy="18" r="3" fill="#171717" />
          <circle cx="30" cy="18" r="3" fill="#171717" />
          <path d="M14 30C17 34 27 34 30 30" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        {/* Left Column */}
        <div>
          <h1 className="display-headline" style={{ margin: 0, marginBottom: 16 }}>
            learn smarter,<br />together
          </h1>

          <div className="handwritten-caption" style={{ marginBottom: 24, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: -60, top: 8, width: 48 }} viewBox="0 0 48 20" className="hand-arrow">
              <path d="M1 10C15 3 30 12 47 10" />
              <path d="M38 3L47 10L38 17" />
            </svg>
            built for universities, coaching institutes &amp; enterprises
          </div>

          <p style={{ fontFamily: 'var(--font-geist)', fontSize: 18, lineHeight: 1.6, color: 'var(--color-charcoal)', maxWidth: 460, marginBottom: 32 }}>
            a complete learning management system with live classes, uploaded content, assessments, and progress tracking — all in one place.{' '}
            <span className="marker-highlight">no more juggling tools.</span>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <button className="pill-btn" onClick={() => scrollTo('contact')}>
              start your journey →
            </button>
            <button className="pill-btn" onClick={() => scrollTo('features')}>
              explore features
            </button>
          </div>

          <p style={{ fontFamily: 'var(--font-gelica)', fontSize: 14, color: 'var(--color-cocoa-ink)' }}>
            free consultation · setup in 48 hours · no credit card needed
          </p>
        </div>

        {/* Right Column — Product Notebook Visual */}
        <div className="product-card" style={{ transform: 'rotate(3deg)', padding: 0, overflow: 'hidden', maxWidth: 460, justifySelf: 'end' }}>
          {/* Notebook cover */}
          <div style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)', padding: 40, position: 'relative' }}>
            {/* Name Label Sticker */}
            <div className="product-card" style={{
              background: 'var(--surface-canvas)',
              padding: 20,
              maxWidth: 240,
              border: '1px solid var(--color-charcoal)',
              borderRadius: 8,
              margin: '0 auto',
              transform: 'rotate(-2deg)',
              boxShadow: 'none'
            }}>
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 20, color: 'var(--color-cocoa-ink)', marginBottom: 4, textTransform: 'lowercase' }}>name: sarah</div>
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 14, color: 'var(--color-charcoal)', marginBottom: 2, textTransform: 'lowercase' }}>class: b.sc. computer science</div>
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 14, color: 'var(--color-charcoal)', textTransform: 'lowercase' }}>roll no: 2024/CS/045</div>
            </div>
          </div>

          {/* Notebook content preview */}
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--color-marker-orange)',
                flexShrink: 0
              }} />
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 14, color: 'var(--color-cocoa-ink)', textTransform: 'lowercase' }}>
                8 courses enrolled
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--color-sprout-sticker)',
                flexShrink: 0
              }} />
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 14, color: 'var(--color-cocoa-ink)', textTransform: 'lowercase' }}>
                next live class in 30 min
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: 'var(--color-sky-sticker)',
                flexShrink: 0
              }} />
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 14, color: 'var(--color-cocoa-ink)', textTransform: 'lowercase' }}>
                87% overall progress
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
