import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

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
        desc: 'Secure registration, login, and role-based access for students, teachers, and admins. Profile management with password reset included.',
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
    { label: 'Role-Based Access Control', detail: 'Students, teachers, and admins have separate permissions' },
    { label: 'Multi-Factor Authentication', detail: 'OTP via email / SMS for additional account security' },
    { label: 'Secure Payment Gateway', detail: 'PCI-DSS compliant — no card details stored on server' },
    { label: 'Session Management', detail: 'Auto-logout and secure session handling' },
];

// ── Main Component ─────────────────────────────────────────────────────────
export default function HomePage() {

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-background text-foreground min-h-screen font-sans transition-colors duration-400 ease-out overflow-x-hidden">

            {/* ── HERO ───────────────────────────────────────────────────────── */}
            <section className="relative w-full py-10 px-6 text-center flex items-center justify-center gap-10 overflow-hidden bg-transparent">
                {/* Background blobs */}
                <div className="absolute -top-20 left-[10%] w-[420px] h-[420px] rounded-full blur-[80px] pointer-events-none opacity-50 bg-blue-600/10 dark:bg-blue-600/18" />
                <div className="absolute -bottom-10 right-[8%] w-[360px] h-[360px] rounded-full blur-[70px] pointer-events-none opacity-50 bg-cyan-400/8 dark:bg-cyan-400/12" />

                {/* Main Content Container */}
                <div className="relative z-10 max-w-[800px] mx-auto flex flex-col items-center gap-10">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 border border-blue-600/25 dark:border-blue-600/40 rounded-full px-4 py-1.5 text-xs font-medium mb-6 bg-blue-600/8 dark:bg-blue-600/18 text-blue-700 dark:text-blue-300">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        E-LEARNING PLATFORM
                    </div>

                    {/* Headline */}
                    <h1 className="font-sans text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight text-foreground">
                        Learn Smarter,{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Grow Faster
                        </span>
                        <br className="hidden md:block" />
                        with Our E-Learning Platform
                    </h1>

                    {/* Subtext */}
                    <p className="text-base md:text-lg max-w-[520px] mx-auto mb-10 leading-relaxed text-muted-foreground">
                        A complete digital learning experience — live classes, smart assessments, real-time progress tracking, and secure access for students, teachers, and administrators.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            unstyled
                            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:opacity-90 transition-opacity"
                            onClick={() => scrollTo('contact')}
                        >
                            Start Your Journey →
                        </Button>

                        <Button
                            unstyled
                            className="px-8 py-3 rounded-xl border border-border text-foreground font-semibold transition-all hover:border-blue-600/35 dark:hover:border-blue-500/50"
                            onClick={() => scrollTo('features')}
                        >
                            Explore Features
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── STATS ─────────────────────────────────────────────────────── */}
            <section className="px-10 pb-[70px] flex items-center justify-center">
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
                                className="rounded-[18px] p-7 text-center border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-300 hover:border-blue-500/35 dark:hover:border-blue-500/50"
                            >
                                <div className="font-['Syne',_sans-serif] text-[2.1rem] font-extrabold bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent mb-1.5">
                                    {num}
                                </div>
                                <div className="text-[13px] text-muted-foreground">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* ── FEATURES / MODULES ────────────────────────────────────────── */}
            <section id="features" className="px-10 py-[70px] transition-colors duration-400 flex items-center justify-center">
                <div className="max-w-[1100px] mx-auto">
                    <AnimatedSection>
                        <p className="text-[12px] font-medium tracking-[2.5px] uppercase mb-2.5 text-blue-700 dark:text-blue-300">
                            Platform Modules
                        </p>
                        <h2 className="font-['Syne',_sans-serif] text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold leading-[1.2] mb-3.5 text-foreground">
                            Everything in One Place
                        </h2>
                        <p className="text-[15px] max-w-[480px] leading-relaxed mb-11 text-muted-foreground">
                            From enrollment to certification — our platform covers every step of the learning journey for students and educators alike.
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                        {MODULES.map(({ icon, title, desc }, i) => (
                            <AnimatedSection key={title} delay={i * 60}>
                                <div className="group h-full rounded-[20px] p-[28px_26px] border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-300 hover:border-blue-500/35 dark:hover:border-blue-500/50 hover:shadow-[0_8px_32px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:bg-[#f0f5ff] dark:hover:bg-blue-600/10">
                                    <div className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center text-[22px] mb-4 bg-blue-600/8 dark:bg-blue-600/18">
                                        {icon}
                                    </div>
                                    <h3 className="font-['Syne',_sans-serif] text-[16px] font-bold mb-2 text-foreground">
                                        {title}
                                    </h3>
                                    <p className="text-[14px] leading-[1.65] text-muted-foreground">
                                        {desc}
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VIRTUAL CLASSROOM ─────────────────────────────────────────── */}
            <section id="classroom" className="px-10 py-20">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                    {/* Text */}
                    <AnimatedSection>
                        <p className="text-[12px] font-medium tracking-[2.5px] uppercase mb-2.5 text-blue-700 dark:text-blue-300">Virtual Classroom</p>
                        <h2 className="font-['Syne',_sans-serif] text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold text-foreground mb-4 leading-[1.2]">
                            Live Classes That Feel Real
                        </h2>
                        <p className="text-[15px] text-muted-foreground leading-[1.7] mb-8">
                            Our virtual classroom brings the energy of a real class online. Teachers can share their screen, answer questions live, and keep students engaged — all in your browser.
                        </p>

                        {[
                            { icon: '🎙️', text: 'Live video lectures with HD quality' },
                            { icon: '🖥️', text: 'Screen sharing and presentation mode' },
                            { icon: '💬', text: 'Real-time chat and interactive Q&A' },
                            { icon: '⏺️', text: 'Session recording for replay anytime' },
                            { icon: '📅', text: 'Scheduled classes with reminders' },
                        ].map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-3 mb-3.5">
                                <div className="w-[34px] h-[34px] rounded-[10px] bg-blue-600/8 dark:bg-blue-600/18 flex items-center justify-center text-[16px] shrink-0">
                                    {icon}
                                </div>
                                <span className="text-[14px] text-foreground">{text}</span>
                            </div>
                        ))}
                    </AnimatedSection>

                    {/* Visual Card */}
                    <AnimatedSection delay={120}>
                        <div className="bg-gradient-to-br from-[#eff6ff] to-[#ecfeff] dark:from-[#1a2035] dark:to-[#0f1729] border border-border rounded-[24px] p-8 relative overflow-hidden">
                            {/* Fake classroom UI */}
                            <div className="bg-[#1e293b] dark:bg-[#0d1117] rounded-[16px] p-4 mb-4">
                                {/* Video placeholder */}
                                <div className="bg-[#0f172a] dark:bg-[#161b27] rounded-[12px] aspect-video flex items-center justify-center mb-3 relative overflow-hidden">
                                    <div className="absolute top-2.5 left-3 bg-red-500 text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium">● LIVE</div>
                                    <div className="text-[40px]">🎓</div>
                                    <div className="absolute bottom-2.5 right-3 flex gap-2">
                                        {['🎙️', '📹', '🖥️'].map((ic) => (
                                            <div key={ic} className="w-7 h-7 bg-white/12 rounded-[8px] flex items-center justify-center text-[13px]">{ic}</div>
                                        ))}
                                    </div>
                                </div>
                                {/* Attendees row */}
                                <div className="flex gap-2">
                                    {['A', 'B', 'C', 'D'].map((l) => (
                                        <div key={l} className="w-9 h-9 rounded-[8px] bg-[#334155] dark:bg-[#1a2035] flex items-center justify-center text-[#93bbff] text-[13px] font-semibold">{l}</div>
                                    ))}
                                    <div className="w-9 h-9 rounded-[8px] bg-blue-600/8 dark:bg-blue-600/18 border border-blue-500/35 dark:border-blue-500/50 flex items-center justify-center text-blue-700 dark:text-blue-300 text-[11px]">+48</div>
                                </div>
                            </div>
                            {/* Chat strip */}
                            <div className="bg-[#f8fafc] dark:bg-[#0d1117] rounded-[14px] p-3.5">
                                <p className="text-[12px] text-muted-foreground mb-2.5">Live Chat</p>
                                {[
                                    { name: 'Rahul', msg: 'Can you re-explain slide 3?' },
                                    { name: 'Priya', msg: 'Really helpful session, thanks!' },
                                ].map(({ name, msg }) => (
                                    <div key={name} className="flex gap-2.5 mb-2.5">
                                        <div className="w-[26px] h-[26px] rounded-full bg-blue-600/8 dark:bg-blue-600/18 flex items-center justify-center text-[11px] text-blue-700 dark:text-blue-300 font-semibold shrink-0">
                                            {name[0]}
                                        </div>
                                        <div>
                                            <span className="text-[12px] font-medium text-foreground">{name} </span>
                                            <span className="text-[12px] text-muted-foreground">{msg}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── BENEFITS ──────────────────────────────────────────────────── */}
            <section id="benefits" className="px-10 py-20 bg-muted/40 dark:bg-muted/20 transition-colors duration-400">
                <div className="max-w-[1100px] mx-auto">
                    <AnimatedSection>
                        <p className="text-[12px] font-medium tracking-[2.5px] uppercase mb-2.5 text-blue-700 dark:text-blue-300">Why Choose Us</p>
                        <h2 className="font-['Syne',_sans-serif] text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold text-foreground mb-3.5 leading-[1.2]">
                            Built for Real Results
                        </h2>
                        <p className="text-[15px] text-muted-foreground max-w-[500px] leading-[1.7] mb-11">
                            Designed to help institutions, coaching centres, universities, and companies deliver education that actually works.
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {BENEFITS.map(({ icon, title, desc }, i) => (
                            <AnimatedSection key={title} delay={i * 70}>
                                <div className="bg-card border border-border rounded-[18px] p-[24px_22px] flex gap-4 items-start shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-blue-500/35 dark:hover:border-blue-500/50 hover:bg-[#f0f5ff] dark:hover:bg-blue-600/8 transition-all duration-300">
                                    <div className="w-11 h-11 rounded-[12px] bg-blue-600/8 dark:bg-blue-600/18 flex items-center justify-center text-[22px] shrink-0">
                                        {icon}
                                    </div>
                                    <div>
                                        <h3 className="font-['Syne',_sans-serif] text-[15px] font-bold text-foreground mb-1.5">{title}</h3>
                                        <p className="text-[13px] text-muted-foreground leading-[1.6]">{desc}</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECURITY ──────────────────────────────────────────────────── */}
            <section id="security" className="px-10 py-20">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                    <AnimatedSection>
                        <p className="text-[12px] font-medium tracking-[2.5px] uppercase mb-2.5 text-blue-700 dark:text-blue-300">Security & Trust</p>
                        <h2 className="font-['Syne',_sans-serif] text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold text-foreground mb-4 leading-[1.2]">
                            Your Data is Safe with Us
                        </h2>
                        <p className="text-[15px] text-muted-foreground leading-[1.7]">
                            Enterprise-grade security at every layer. From login to payment — your institution's data and your students' privacy are fully protected.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={100}>
                        <div className="flex flex-col gap-3">
                            {SECURITY_FEATURES.map(({ label, detail }) => (
                                <div
                                    key={label}
                                    className="bg-card border border-border rounded-[14px] px-5 py-4 flex items-center gap-3.5 shadow-[0_1px_6px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-blue-500/35 dark:hover:border-blue-500/50 transition-colors duration-300"
                                >
                                    <div className="w-[34px] h-[34px] rounded-[10px] bg-cyan-400/10 dark:bg-cyan-400/15 flex items-center justify-center shrink-0">
                                        <span className="text-[16px]">🔒</span>
                                    </div>
                                    <div>
                                        <div className="text-[14px] font-medium text-foreground mb-0.5">{label}</div>
                                        <div className="text-[12px] text-muted-foreground">{detail}</div>
                                    </div>
                                    <div className="ml-auto w-[22px] h-[22px] rounded-full bg-cyan-400/10 dark:bg-cyan-400/15 flex items-center justify-center shrink-0">
                                        <span className="text-[12px] text-cyan-500">✓</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── CTA / CONTACT ─────────────────────────────────────────────── */}
            <section id="contact" className="px-10 pt-10 pb-20">
                <AnimatedSection>
                    <div className="max-w-[1100px] mx-auto bg-gradient-to-br from-[#eff6ff] to-[#ecfeff] dark:from-blue-600/22 dark:to-cyan-500/15 border border-blue-600/20 dark:border-blue-600/35 rounded-[28px] px-10 py-16 text-center relative overflow-hidden">
                        {/* Decorative blob */}
                        <div className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] rounded-full bg-blue-600/6 dark:bg-blue-600/10 blur-[50px] pointer-events-none" />

                        <div className="text-[44px] mb-5">🎓</div>
                        <h2 className="font-['Syne',_sans-serif] text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-foreground mb-4 leading-[1.15]">
                            Ready to Modernize Your<br />Learning Experience?
                        </h2>
                        <p className="text-[16px] text-muted-foreground max-w-[500px] mx-auto mb-9 leading-[1.7]">
                            Let's build a platform tailored for your institution. Contact Multifacet Softwares Systems today for a free consultation.
                        </p>

                        <div className="flex gap-3.5 justify-center flex-wrap mb-9">
                            <Button unstyled className="btn-primary-glow" style={{ animationDuration: '4s' }}>
                                Request a Demo
                            </Button>
                            <a
                                href="mailto:info@multifacetsystems.com"
                                className="inline-block border border-border text-foreground px-[30px] py-[13px] rounded-full text-[15px] no-underline transition-all duration-200 hover:border-blue-600 hover:text-blue-600"
                            >
                                📧 Contact Us
                            </a>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────────────── */}
            <footer className="px-10 py-7 border-t border-border flex items-center justify-between flex-wrap gap-3">
                <div className="font-['Syne',_sans-serif] font-extrabold text-[18px] bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    E-Learning
                </div>
                <p className="text-[13px] text-muted-foreground">
                    © 2025 Multifacet Softwares Systems (P) Ltd. · Kanpur
                </p>
                <div className="flex gap-5">
                    {['Features', 'Live Classes', 'Security', 'Contact'].map((link) => (
                        <Button
                            unstyled
                            key={link}
                            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => scrollTo(link.toLowerCase().replace(' ', ''))}
                        >
                            {link}
                        </Button>
                    ))}
                </div>
            </footer>
        </div>
    );
}