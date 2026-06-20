import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="superr" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--surface-canvas)', borderBottom: '1px solid var(--color-charcoal)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" className="brand-mark" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="6" width="24" height="20" rx="3" stroke="#171717" strokeWidth="1.5" fill="#fdfbf9" />
            <path d="M16 14L22 18L16 22L10 18L16 14Z" fill="#171717" />
            <circle cx="16" cy="18" r="2" fill="#ff6f1e" />
            <path d="M10 10H22" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: 'var(--font-gelica)', fontSize: 20, color: 'var(--color-cocoa-ink)', textTransform: 'lowercase' }}>elearn</span>
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" className="nav-link">features</a>
          <a href="/programs" className="nav-link">programs</a>
          <a href="#classroom" className="nav-link">live classes</a>
          <a href="#why-us" className="nav-link">why us</a>
          <a href="#contact" className="nav-link">contact</a>
          <button className="pill-btn" onClick={() => navigate('/login')}>
            get started
          </button>
        </nav>
      </div>
    </header>
  );
}
