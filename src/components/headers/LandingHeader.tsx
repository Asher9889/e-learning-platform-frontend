import { Button } from "@/components/ui/button";
import ThemeToggle from "../toggle/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";

export  function LandingHeader() {
  const { theme } = useTheme();
    // const isDark = theme === 'dark';
      const navigate = useNavigate();
// const scrollTo = (id: string) => {
//     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
//     setMenuOpen(false);
//   };
    console.log(theme,"")
  return (
   <header className=" sticky top-0 z-50 border-b-6   border-gray-800 dark:border-gray-100  backdrop-blur flex items-center justify-center h-16 px-10">
    <style>{`
    
            * { box-sizing: border-box; margin: 0; }
    
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(28px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes floatY {
              0%,100% { transform: translateY(0px); }
              50%      { transform: translateY(-8px); }
            }
            @keyframes pulseDot {
              0%,100% { opacity: 0.6; transform: scale(1); }
              50%      { opacity: 1;   transform: scale(1.3); }
            }
            @keyframes gradientShift {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes blobMove {
              0%,100% { transform: scale(1) translate(0,0); }
              33%      { transform: scale(1.08) translate(20px,-15px); }
              66%      { transform: scale(0.95) translate(-15px,20px); }
            }
    
            .hero-a1 { animation: fadeUp 0.7s ease both; }
            .hero-a2 { animation: fadeUp 0.7s 0.1s ease both; }
            .hero-a3 { animation: fadeUp 0.7s 0.2s ease both; }
            .hero-a4 { animation: fadeUp 0.7s 0.3s ease both; }
            .hero-a5 { animation: fadeUp 0.7s 0.4s ease both; }
    
            .btn-primary-glow {
              background: linear-gradient(135deg, #2563eb, #0284c7);
              background-size: 200% 200%;
              animation: floatY 3.5s ease-in-out infinite, gradientShift 4s ease infinite;
              color: #fff;
              border: none;
              padding: 14px 34px;
              border-radius: 50px;
              font-size: 15px;
              font-weight: 500;
              cursor: pointer;
              letter-spacing: 0.02em;
              font-family: inherit;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .btn-primary-glow:hover {
              transform: translateY(-3px) scale(1.03) !important;
              box-shadow: 0 10px 28px rgba(37,99,235,0.45) !important;
              animation-play-state: paused;
            }
    
            .btn-outline {
              border: 1.5px solid;
              padding: 13px 30px;
              border-radius: 50px;
              font-size: 15px;
              font-weight: 400;
              cursor: pointer;
              background: transparent;
              font-family: inherit;
              transition: all 0.2s;
            }
            .btn-outline:hover {
              transform: translateY(-2px);
            }
    
            .nav-link {
              cursor: pointer;
              font-size: 14px;
              font-weight: 400;
              transition: color 0.2s;
              background: none;
              border: none;
              font-family: inherit;
            }
    
            .feat-card-inner {
              transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
            }
            .feat-card-inner:hover {
              transform: translateY(-6px);
            }
    
            .stat-card-inner {
              transition: transform 0.3s ease, border-color 0.3s ease;
            }
            .stat-card-inner:hover {
              transform: translateY(-4px);
            }
    
            .sec-badge-inner {
              transition: background 0.4s;
            }
            .blob {
              animation: blobMove 8s ease-in-out infinite;
            }
            .blob2 {
              animation: blobMove 11s 2s ease-in-out infinite;
            }
    
            .theme-toggle {
              width: 52px;
              height: 28px;
              border-radius: 50px;
              border: none;
              cursor: pointer;
              position: relative;
              transition: background 0.3s;
              flex-shrink: 0;
            }
            .theme-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #fff;
              position: absolute;
              top: 4px;
              transition: left 0.3s cubic-bezier(.4,0,.2,1);
              box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
            }
    
            @media (max-width: 768px) {
              .desktop-nav { display: none !important; }
              .mobile-menu-btn { display: flex !important; }
            }
            @media (min-width: 769px) {
              .mobile-menu-btn { display: none !important; }
              .mobile-menu { display: none !important; }
            }
          `}</style>
  <div className="mx-auto w-full  max-w-[1100px]  flex h-16 items-center justify-between ">

      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, background: 'linear-gradient(90deg, #2563eb, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            E-Learning
          </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#features">Features</a>
           <a href="#classroom">Live Classes</a>
          <a href="#benefits">Benefits</a>
          <a href="#security">Security</a>
          <a href="#contact">Contact</a>

        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Theme toggle */}
            {/* <Button
              className="theme-toggle"
            //   onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
              style={{ background: isDark ? '#2563eb' : '#cbd5e1' }}
            >
              <div className="theme-thumb" style={{ left: isDark ? 28 : 4 }}>
                {isDark ? '🌙' : '☀️'}
              </div>
            </Button> */}
             <ThemeToggle />

            <Button
              onClick={() => navigate('/login')}
            variant="outline"
              style={{
                background: "#2563eb",
                color: '#fff',
                border: 'none',
                padding: '9px 22px',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              Get Started
            </Button>

            {/* Mobile menu button */}
            {/* <Button
              className="mobile-menu-btn"
            //   onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, display: 'none', alignItems: 'center' }}
            >
              {menuOpen ? '✕' : '☰'}
            </Button> */}
          </div>

      </div>
</header>
  );
}