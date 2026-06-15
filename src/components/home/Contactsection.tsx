interface ContactSectionProps {
  scrollTo: (id: string) => void;
}

export function ContactSection({ scrollTo }: ContactSectionProps) {
  return (
    <section id="contact" className="superr" style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="product-card" style={{
          padding: '56px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Sticker decorations */}
          <div className="sticker" style={{ position: 'absolute', top: 20, left: 20, transform: 'rotate(-8deg)' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" fill="#3b82f6" stroke="#171717" strokeWidth="2" />
              <path d="M12 18L16 22L24 14" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="sticker" style={{ position: 'absolute', bottom: 20, right: 20, transform: 'rotate(12deg)' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="#ff66cf" stroke="#171717" strokeWidth="2" />
              <path d="M16 8V24M8 16H24" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 24, color: 'var(--color-marker-orange)', marginBottom: 12, textTransform: 'lowercase' }}>
            ready to transform?
          </div>
          <h2 className="display-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 auto 16', maxWidth: 600 }}>
            let's build your<br />learning future
          </h2>
          <p style={{
            fontFamily: 'var(--font-geist)', fontSize: 16, lineHeight: 1.6,
            color: 'var(--color-charcoal)', maxWidth: 480, margin: '0 auto 32',
          }}>
            free consultation · custom demo tailored to your institution · setup in 48 hours · dedicated support team
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button className="pill-btn" onClick={() => window.location.href = 'mailto:info@multifacetsystems.com'}>
              talk to us →
            </button>
            <button className="pill-btn" onClick={() => scrollTo('features')}>
              see what we built
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
