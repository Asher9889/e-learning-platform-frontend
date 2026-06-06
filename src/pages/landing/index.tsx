// import { Button } from '@/components/ui/button';
// import CourseCard from '../../components/CourseCard';
// import Navbar from '../../components/Navbar';

// export default function LandingPage() {
//     return (
//         <div className="min-h-screen bg-white">
//             <Navbar />

//             {/* Hero Section */}
//             <section className="pt-32 pb-16 px-4 text-center">
//                 <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
//                     Future of <span className="text-blue-600">Learning</span>
//                 </h1>
//                 <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
//                     Expert-led courses, live classes, and tracking tools to help you succeed in your career.
//                 </p>
//                 <Button
//                     variant="ghost"
//                     className="bg-gray-900 text-white px-8 py-6 rounded-full hover:bg-gray-800
//     hover:text-white hover:scale-105 transition-all duration-300">
//                     Start Your Journey
//                 </Button>
//             </section>

//             {/* Stats/Features Section */}
//             <section className="py-16 px-4 bg-gray-50">
//                 <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
//                     <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
//                         <h3 className="text-2xl font-bold mb-2">2,000+</h3>
//                         <p className="text-gray-500">Active Students</p>
//                     </div>
//                     <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
//                         <h3 className="text-2xl font-bold mb-2">500+</h3>
//                         <p className="text-gray-500">Expert Courses</p>
//                     </div>
//                     <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
//                         <h3 className="text-2xl font-bold mb-2">98%</h3>
//                         <p className="text-gray-500">Success Rate</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
//                     <CourseCard
//                         course={{
//                             title: 'React Native Mastery',
//                             thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500',
//                             instructor: 'Anubhav Srivastava',
//                             category: 'Mobile Development',
//                             level: 'Advanced',
//                             rating: 4.8,
//                             reviewCount: 1250,
//                             duration: '18h',
//                             studentsEnrolled: 5400,
//                             price: 2999,
//                             featured: true,
//                         }}
//                     />
//                     <CourseCard
//                         course={{
//                             title: 'Next.js Full Stack',
//                             thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=500',
//                             instructor: 'Mentor',
//                             category: 'Web Development',
//                             level: 'Intermediate',
//                             rating: 4.7,
//                             reviewCount: 890,
//                             duration: '14h',
//                             studentsEnrolled: 3200,
//                             price: 2499,
//                             featured: false,
//                         }}
//                     />
//                 </div>
//             </section>
//         </div>
//     );
// }

'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

// ── useInView hook for scroll animations ──────────────────────────────────
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

// ── AnimatedSection wrapper ────────────────────────────────────────────────
function AnimatedSection({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const { ref, inView } = useInView();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0px)' : 'translateY(36px)',
                transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

// ── Data ───────────────────────────────────────────────────────────────────
const MODULES = [
    {
        icon: '👥',
        title: 'User Management',
        desc: 'Secure registration, login, and role-based access for students, instructors, and admins. Profile management with password reset included.',
    },
    {
        icon: '📚',
        title: 'Course Management',
        desc: 'Create and organize courses with videos, PDFs, and slides. Structured modules with category-based navigation.',
    },
    {
        icon: '📊',
        title: 'Learning Dashboard',
        desc: 'Real-time progress tracking, structured learning paths, and bookmark & resume features for every learner.',
    },
    {
        icon: '🎥',
        title: 'Virtual Classroom',
        desc: 'Live video lectures, screen sharing, interactive Q&A chat, and session recording for later playback.',
    },
    {
        icon: '📝',
        title: 'Assessments & Exams',
        desc: 'Online quizzes, timed tests, and assignments with automated grading. Instant result declaration for students.',
    },
    {
        icon: '🔔',
        title: 'Smart Notifications',
        desc: 'Real-time alerts for class schedules, new content, grades, and announcements via WebSocket.',
    },
];

const BENEFITS = [
    { icon: '🌐', title: 'Learn Anytime, Anywhere', desc: 'Access all courses and live sessions from any device — desktop, tablet, or mobile.' },
    { icon: '🎙️', title: 'Live Interactive Classes', desc: 'Join real-time video sessions with chat, screen sharing, and Q&A — just like a real classroom.' },
    { icon: '⚡', title: 'Scalable for All Sizes', desc: 'Supports 2,000+ concurrent users. Perfect for schools, coaching centres, and large corporates.' },
    { icon: '🏆', title: 'Centralized Learning Hub', desc: 'Courses, assignments, quizzes, progress reports, and certificates — all in one place.' },
    { icon: '📈', title: 'Performance Tracking', desc: "Monitor every student's progress with automated reports and real-time analytics." },
    { icon: '🤖', title: 'Future-Ready Platform', desc: 'Ready for AI features, mobile apps, multi-language support, and cloud scaling.' },
];

const SECURITY_FEATURES = [
    { label: 'JWT Authentication', detail: 'Secure token-based login for all users' },
    { label: 'HTTPS / SSL Encryption', detail: 'All data transmitted is fully encrypted' },
    { label: 'Role-Based Access Control', detail: 'Students, instructors, and admins have separate permissions' },
    { label: 'Multi-Factor Authentication', detail: 'OTP via email / SMS for additional account security' },
    { label: 'Secure Payment Gateway', detail: 'PCI-DSS compliant — no card details stored on server' },
    { label: 'Session Management', detail: 'Auto-logout and secure session handling' },
];

// ── Main Component ─────────────────────────────────────────────────────────
export default function LandingPage() {
    const { theme } = useTheme(); // Custom hook to get current theme (light/dark)

    console.log(theme, 'theme in landing page')

    // Scroll listener for navbar shadow
    // useEffect(() => {
    //     const onScroll = () => setScrolled(window.scrollY > 20);
    //     window.addEventListener('scroll', onScroll);
    //     return () => window.removeEventListener('scroll', onScroll);
    // }, []);

    const isDark = theme === 'dark';

    // ── Theme tokens ────────────────────────────────────────────────────────
    const t = {
        bg: isDark ? '#0d1117' : '#ffffff',
        bgSoft: isDark ? '#161b27' : '#f5f7ff',
        bgCard: isDark ? '#1a2035' : '#ffffff',
        border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        borderHover: isDark ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.35)',
        text: isDark ? '#e8eeff' : '#0f172a',
        textMuted: isDark ? '#8a9cc8' : '#64748b',
        accent: '#2563eb',
        accentLight: isDark ? 'rgba(37,99,235,0.18)' : 'rgba(37,99,235,0.08)',
        accentText: isDark ? '#93bbff' : '#1d4ed8',
        cyan: '#06b6d4',
        navBg: isDark ? 'rgba(13,17,23,0.88)' : 'rgba(255,255,255,0.88)',
        heroBlobA: isDark ? 'rgba(37,99,235,0.18)' : 'rgba(37,99,235,0.10)',
        heroBlobB: isDark ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.08)',
        shadow: isDark ? '0 8px 32px rgba(0,0,0,0.45)' : '0 8px 32px rgba(37,99,235,0.12)',
    };

    // ── Smooth scroll helper ────────────────────────────────────────────────
    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        // setMenuOpen(false);
    };

    return (
        <div
            // style={{
            //     background: t.bg,
            //     color: t.text,
            //     minHeight: '100vh',
            //     fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            //     transition: 'background 0.4s ease, color 0.4s ease',
            //     overflowX: 'hidden',
            // }}
            className='bg-[#ffffff] dark:bg-[#0d1117] text-[#0f172a] dark:text-[#e8eeff] min-h-screen font-sans transition-colors duration-400 ease-out overflow-x-hidden'

        >
            {/* Google Fonts */}


            {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
            {/* <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: t.navBg,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${scrolled ? t.border : 'transparent'}`,
          boxShadow: scrolled ? (isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)') : 'none',
          transition: 'all 0.3s ease',
          padding: '0 40px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo 
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, background: 'linear-gradient(90deg, #2563eb, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            LearnX
          </div>

          {/* Desktop Nav Links
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['features', 'classroom', 'benefits', 'security', 'contact'].map((id) => (
              <button
                key={id}
                className="nav-link"
                onClick={() => scrollTo(id)}
                style={{ color: t.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = t.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = t.textMuted)}
              >
                {id === 'classroom' ? 'Live Classes' : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>

          {/* Right side 
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Theme toggle 
            <button
              className="theme-toggle"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
              style={{ background: isDark ? '#2563eb' : '#cbd5e1' }}
            >
              <div className="theme-thumb" style={{ left: isDark ? 28 : 4 }}>
                {isDark ? '🌙' : '☀️'}
              </div>
            </button>

            <button
              onClick={() => scrollTo('contact')}
              style={{
                background: t.accent,
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
            </button>

            {/* Mobile menu button 
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.text, fontSize: 22, display: 'none', alignItems: 'center' }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu 
        {menuOpen && (
          <div
            className="mobile-menu"
            style={{
              background: t.bgCard,
              borderTop: `1px solid ${t.border}`,
              padding: '16px 40px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {['features', 'classroom', 'benefits', 'security', 'contact'].map((id) => (
              <button
                key={id}
                className="nav-link"
                onClick={() => scrollTo(id)}
                style={{ color: t.text, textAlign: 'left' }}
              >
                {id === 'classroom' ? 'Live Classes' : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
        )}
      </nav> */}
            {/* ── HERO ───────────────────────────────────────────────────────── */}
            <section className="relative w-full py-20 px-6 text-center  flex item-center justify-center gap-10 overflow-hidden bg-transparent">
                {/* Background blobs - Dibuat absolute dengan z-index rendah agar tidak menutupi konten */}
                <div
                    className="absolute -top-20 left-[10%] w-[420px] h-[420px] rounded-full blur-[80px] pointer-events-none opacity-50"
                    style={{ background: t.heroBlobA }}
                />
                <div
                    className="absolute -bottom-10 right-[8%] w-[360px] h-[360px] rounded-full blur-[70px] pointer-events-none opacity-50"
                    style={{ background: t.heroBlobB }}
                />

                {/* Main Content Container */}
                <div className="relative z-10 max-w-[800px] mx-auto flex flex-col items-center gap-10">

                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-medium mb-6 ${isDark ? 'border-blue-600/40' : 'border-blue-600/25'}`} style={{ color: t.accentText, background: t.accentLight }}>
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        E-LEARNING PLATFORM
                    </div>

                    {/* Headline */}
                    <h1 className="font-sans text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight" style={{ color: t.text }}>
                        Learn Smarter,{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Grow Faster
                        </span>
                        <br className="hidden md:block" />
                        with Our E-Learning Platform
                    </h1>

                    {/* Subtext */}
                    <p className="text-base md:text-lg max-w-[520px] mx-auto mb-10 leading-relaxed" style={{ color: t.textMuted }}>
                        A complete digital learning experience — live classes, smart assessments, real-time progress tracking, and secure access for students, instructors, and administrators.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <Button
                            unstyled className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:opacity-90 transition-opacity" onClick={() => scrollTo('contact')}>
                            Start Your Journey →
                        </Button>


                        <Button
                            unstyled

                            className="!px-8 !py-3 rounded-xl text-white border font-semibold transition-all"
                            onClick={() => scrollTo('features')}
                            style={{ borderColor: t.border, color: t.text }}
                        >
                            Explore Features
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── STATS ─────────────────────────────────────────────────────── */}
            <section className="px-10 pb-[70px] flex items-center justify-center" >
                <AnimatedSection>
                    <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { num: '2,000+', label: 'Concurrent Users' },
                            { num: '100%', label: 'Browser Compatible' },
                            { num: '24/7', label: 'Platform Availability' },
                            { num: '5-Star', label: 'Security Standards' },
                        ].map(({ num, label }) => (
                            <div
                                key={label}
                                className={`stat-card-inner rounded-[18px] p-7 text-center border transition-colors duration-300 ${isDark ? 'shadow-none' : 'shadow-[0_2px_12px_rgba(0,0,0,0.05)]'
                                    }`}
                                style={{
                                    background: t.bgCard,
                                    borderColor: t.border,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.borderHover)}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
                            >
                                <div
                                    className="font-['Syne',_sans-serif] text-[2.1rem] font-extrabold bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent mb-1.5"
                                >
                                    {num}
                                </div>
                                <div className="text-[13px]" style={{ color: t.textMuted }}>
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* ── FEATURES / MODULES ────────────────────────────────────────── */}
            <section id="features" className="px-10 py-[70px] transition-colors duration-400 flex items-center justify-center" >
                <div className="max-w-[1100px] mx-auto">
                    <AnimatedSection>
                        <p className="text-[12px] font-medium tracking-[2.5px] uppercase mb-2.5" style={{ color: t.accentText }}>
                            Platform Modules
                        </p>
                        <h2 className="font-['Syne',_sans-serif] text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold leading-[1.2] mb-3.5" style={{ color: t.text }}>
                            Everything in One Place
                        </h2>
                        <p className="text-[15px] max-w-[480px] leading-relaxed mb-11" style={{ color: t.textMuted }}>
                            From enrollment to certification — our platform covers every step of the learning journey for students and educators alike.
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                        {MODULES.map(({ icon, title, desc }, i) => (
                            <AnimatedSection key={title} delay={i * 60}>
                                <div
                                    className={`group h-full rounded-[20px] p-[28px_26px] border transition-all duration-300 ${isDark ? 'shadow-none' : 'shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
                                        }`}
                                    style={{
                                        background: t.bgCard,
                                        borderColor: t.border,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = t.borderHover;
                                        e.currentTarget.style.boxShadow = t.shadow;
                                        e.currentTarget.style.background = isDark ? 'rgba(37,99,235,0.1)' : '#f0f5ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = t.border;
                                        e.currentTarget.style.boxShadow = isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.04)';
                                        e.currentTarget.style.background = t.bgCard;
                                    }}
                                >
                                    <div
                                        className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center text-[22px] mb-4"
                                        style={{ background: t.accentLight }}
                                    >
                                        {icon}
                                    </div>
                                    <h3 className="font-['Syne',_sans-serif] text-[16px] font-bold mb-2" style={{ color: t.text }}>
                                        {title}
                                    </h3>
                                    <p className="text-[14px] leading-[1.65]" style={{ color: t.textMuted }}>
                                        {desc}
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VIRTUAL CLASSROOM ─────────────────────────────────────────── */}
            <section id="classroom" style={{ padding: '80px 40px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
                    {/* Text */}
                    <AnimatedSection>
                        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: t.accentText, marginBottom: 10 }}>Virtual Classroom</p>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 800, color: t.text, marginBottom: 16, lineHeight: 1.2 }}>
                            Live Classes That Feel Real
                        </h2>
                        <p style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
                            Our virtual classroom brings the energy of a real class online. Instructors can share their screen, answer questions live, and keep students engaged — all in your browser.
                        </p>

                        {[
                            { icon: '🎙️', text: 'Live video lectures with HD quality' },
                            { icon: '🖥️', text: 'Screen sharing and presentation mode' },
                            { icon: '💬', text: 'Real-time chat and interactive Q&A' },
                            { icon: '⏺️', text: 'Session recording for replay anytime' },
                            { icon: '📅', text: 'Scheduled classes with reminders' },
                        ].map(({ icon, text }) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: t.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                                    {icon}
                                </div>
                                <span style={{ fontSize: 14, color: t.text }}>{text}</span>
                            </div>
                        ))}
                    </AnimatedSection>

                    {/* Visual Card */}
                    <AnimatedSection delay={120}>
                        <div
                            style={{
                                background: isDark ? 'linear-gradient(135deg, #1a2035, #0f1729)' : 'linear-gradient(135deg, #eff6ff, #ecfeff)',
                                border: `1px solid ${t.border}`,
                                borderRadius: 24,
                                padding: 32,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Fake classroom UI */}
                            <div style={{ background: isDark ? '#0d1117' : '#1e293b', borderRadius: 16, padding: 16, marginBottom: 16 }}>
                                {/* Video placeholder */}
                                <div style={{ background: isDark ? '#161b27' : '#0f172a', borderRadius: 12, aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 10, left: 12, background: '#ef4444', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 50, fontWeight: 500 }}>● LIVE</div>
                                    <div style={{ fontSize: 40 }}>🎓</div>
                                    <div style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', gap: 8 }}>
                                        {['🎙️', '📹', '🖥️'].map((ic) => (
                                            <div key={ic} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{ic}</div>
                                        ))}
                                    </div>
                                </div>
                                {/* Attendees row */}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {['A', 'B', 'C', 'D'].map((l) => (
                                        <div key={l} style={{ width: 36, height: 36, borderRadius: 8, background: isDark ? '#1a2035' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93bbff', fontSize: 13, fontWeight: 600 }}>{l}</div>
                                    ))}
                                    <div style={{ width: 36, height: 36, borderRadius: 8, background: t.accentLight, border: `1px solid ${t.borderHover}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.accentText, fontSize: 11 }}>+48</div>
                                </div>
                            </div>
                            {/* Chat strip */}
                            <div style={{ background: isDark ? '#0d1117' : '#f8fafc', borderRadius: 14, padding: 14 }}>
                                <p style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>Live Chat</p>
                                {[
                                    { name: 'Rahul', msg: 'Can you re-explain slide 3?' },
                                    { name: 'Priya', msg: 'Really helpful session, thanks!' },
                                ].map(({ name, msg }) => (
                                    <div key={name} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: t.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: t.accentText, fontWeight: 600, flexShrink: 0 }}>
                                            {name[0]}
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{name} </span>
                                            <span style={{ fontSize: 12, color: t.textMuted }}>{msg}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── BENEFITS ──────────────────────────────────────────────────── */}
            <section id="benefits" style={{ padding: '80px 40px', background: t.bgSoft, transition: 'background 0.4s' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <AnimatedSection>
                        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: t.accentText, marginBottom: 10 }}>Why Choose Us</p>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 800, color: t.text, marginBottom: 14, lineHeight: 1.2 }}>
                            Built for Real Results
                        </h2>
                        <p style={{ fontSize: 15, color: t.textMuted, maxWidth: 500, lineHeight: 1.7, marginBottom: 44 }}>
                            Designed to help institutions, coaching centres, universities, and companies deliver education that actually works.
                        </p>
                    </AnimatedSection>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                        {BENEFITS.map(({ icon, title, desc }, i) => (
                            <AnimatedSection key={title} delay={i * 70}>
                                <div
                                    className="feat-card-inner"
                                    style={{
                                        background: t.bgCard,
                                        border: `1px solid ${t.border}`,
                                        borderRadius: 18,
                                        padding: '24px 22px',
                                        display: 'flex',
                                        gap: 16,
                                        alignItems: 'flex-start',
                                        boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.borderHover; e.currentTarget.style.background = isDark ? 'rgba(37,99,235,0.08)' : '#f0f5ff'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.bgCard; }}
                                >
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: t.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                        {icon}
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 6 }}>{title}</h3>
                                        <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>{desc}</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECURITY ──────────────────────────────────────────────────── */}
            <section id="security" style={{ padding: '80px 40px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 60, alignItems: 'center' }}>
                    <AnimatedSection>
                        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: t.accentText, marginBottom: 10 }}>Security & Trust</p>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 800, color: t.text, marginBottom: 16, lineHeight: 1.2 }}>
                            Your Data is Safe with Us
                        </h2>
                        <p style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.7, marginBottom: 8 }}>
                            Enterprise-grade security at every layer. From login to payment — your institution's data and your students' privacy are fully protected.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={100}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {SECURITY_FEATURES.map(({ label, detail }, i) => (
                                <div
                                    key={label}
                                    className="feat-card-inner"
                                    style={{
                                        background: t.bgCard,
                                        border: `1px solid ${t.border}`,
                                        borderRadius: 14,
                                        padding: '16px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.04)',
                                        animationDelay: `${i * 50}ms`,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.borderHover; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; }}
                                >
                                    <div style={{ width: 34, height: 34, borderRadius: 10, background: isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: 16 }}>🔒</span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 2 }}>{label}</div>
                                        <div style={{ fontSize: 12, color: t.textMuted }}>{detail}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%', background: isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: 12, color: '#06b6d4' }}>✓</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── CTA / CONTACT ─────────────────────────────────────────────── */}
            <section id="contact" style={{ padding: '40px 40px 80px' }}>
                <AnimatedSection>
                    <div
                        style={{
                            maxWidth: 1100,
                            margin: '0 auto',
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(37,99,235,0.22), rgba(6,182,212,0.15))'
                                : 'linear-gradient(135deg, #eff6ff, #ecfeff)',
                            border: `1px solid ${isDark ? 'rgba(37,99,235,0.35)' : 'rgba(37,99,235,0.2)'}`,
                            borderRadius: 28,
                            padding: '64px 40px',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Decorative blob */}
                        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: isDark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />

                        <div style={{ fontSize: 44, marginBottom: 20 }}>🎓</div>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: t.text, marginBottom: 16, lineHeight: 1.15 }}>
                            Ready to Modernize Your<br />Learning Experience?
                        </h2>
                        <p style={{ fontSize: 16, color: t.textMuted, maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.7 }}>
                            Let's build a platform tailored for your institution. Contact Multifacet Softwares Systems today for a free consultation.
                        </p>

                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
                            <Button unstyled className="btn-primary-glow" style={{ animationDuration: '4s' }}>
                                Request a Demo
                            </Button>
                            <a
                                href="mailto:info@multifacetsystems.com"
                                style={{
                                    display: 'inline-block',
                                    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
                                    color: t.text,
                                    padding: '13px 30px',
                                    borderRadius: 50,
                                    fontSize: 15,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.accent; (e.currentTarget as HTMLElement).style.color = t.accent; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'; (e.currentTarget as HTMLElement).style.color = t.text; }}
                            >
                                📧 Contact Us
                            </a>
                        </div>

                        {/* Address */}

                    </div>
                </AnimatedSection>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────────────── */}
            <footer
                style={{
                    padding: '28px 40px',
                    borderTop: `1px solid ${t.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                }}
            >
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #2563eb, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    E-Learning
                </div>
                <p style={{ fontSize: 13, color: t.textMuted }}>
                    © 2025 Multifacet Softwares Systems (P) Ltd. · Kanpur
                </p>
                <div style={{ display: 'flex', gap: 20 }}>
                    {['Features', 'Live Classes', 'Security', 'Contact'].map((link) => (
                        <Button
                        unstyled
                            key={link}
                            className="nav-link"
                            onClick={() => scrollTo(link.toLowerCase().replace(' ', ''))}
                            style={{ color: t.textMuted, fontSize: 13 }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = t.text)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = t.textMuted)}
                        >
                            {link}
                        </Button>
                    ))}
                </div>
            </footer>
        </div>
    );
}