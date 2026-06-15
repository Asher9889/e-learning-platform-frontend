interface HomeFooterProps {
  scrollTo: (id: string) => void;
}

export function Footer({ scrollTo }: HomeFooterProps) {
  return (
    <footer className="superr">
      {/* Footer Brand Band */}
      <div className="footer-brand-band">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="6" width="24" height="20" rx="3" stroke="#171717" strokeWidth="1.5" fill="#fdfbf9" />
                  <path d="M16 14L22 18L16 22L10 18L16 14Z" fill="#171717" />
                  <circle cx="16" cy="18" r="2" fill="#ff6f1e" />
                </svg>
                <span style={{ fontFamily: 'var(--font-gelica)', fontSize: 20, color: 'var(--color-charcoal)', textTransform: 'lowercase' }}>
                  elearn
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-geist)', fontSize: 13, lineHeight: 1.6, color: 'var(--color-charcoal)', maxWidth: 280 }}>
                a complete learning management platform for universities, coaching institutes, and enterprises who want education that works.
              </p>
            </div>

            {/* Links */}
            <div>
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 16, color: 'var(--color-charcoal)', marginBottom: 14, textTransform: 'lowercase' }}>platform</div>
              {['features', 'live classes', 'why us'].map(link => (
                <div key={link}>
                  <button
                    onClick={() => scrollTo(link === 'live classes' ? 'classroom' : link === 'why us' ? 'why-us' : link)}
                    className="nav-link"
                    style={{ fontSize: 13, display: 'block', marginBottom: 8, border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-geist)', color: 'var(--color-charcoal)' }}
                  >
                    {link}
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 16, color: 'var(--color-charcoal)', marginBottom: 14, textTransform: 'lowercase' }}>company</div>
              {['about', 'blog', 'careers'].map(link => (
                <div key={link} style={{ fontFamily: 'var(--font-geist)', fontSize: 13, marginBottom: 8, textTransform: 'lowercase', color: 'var(--color-charcoal)' }}>
                  {link}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-gelica)', fontSize: 16, color: 'var(--color-charcoal)', marginBottom: 14, textTransform: 'lowercase' }}>contact</div>
              <div style={{ fontFamily: 'var(--font-geist)', fontSize: 13, marginBottom: 8, textTransform: 'lowercase', color: 'var(--color-charcoal)' }}>
                info@multifacetsystems.com
              </div>
              <div style={{ fontFamily: 'var(--font-geist)', fontSize: 13, marginBottom: 8, textTransform: 'lowercase', color: 'var(--color-charcoal)' }}>
                kanpur, india
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(23, 23, 23, 0.2)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: 'var(--font-geist)', fontSize: 12, color: 'var(--color-charcoal)', margin: 0, textTransform: 'lowercase' }}>
              © 2025 multifacet softwares systems (p) ltd. all rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {['privacy', 'terms', 'security'].map(item => (
                <span key={item} style={{ fontFamily: 'var(--font-geist)', fontSize: 12, color: 'var(--color-charcoal)', cursor: 'pointer', textTransform: 'lowercase' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
