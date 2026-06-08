import { AnimatedSection } from './Animatedsection';

const STATS = [
    { num: '2,000+', label: 'Concurrent Users' },
    { num: '100%', label: 'Browser Compatible' },
    { num: '24/7', label: 'Platform Availability' },
    { num: '5-Star', label: 'Security Standards' },
];

export function StatsSection() {
    return (
        <section className="px-10 pb-[70px] flex items-center justify-center">
            <AnimatedSection>
                <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS.map(({ num, label }) => (
                        <div
                            key={label}
                            className="rounded-[18px] p-7 text-center border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-none transition-all duration-300 hover:border-blue-500/35 dark:hover:border-blue-500/50 hover:-translate-y-1"
                        >
                            <div className="font-['Syne',_sans-serif] text-[2.1rem] font-extrabold bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent mb-1.5">
                                {num}
                            </div>
                            <div className="text-[13px] text-muted-foreground">{label}</div>
                        </div>
                    ))}
                </div>
            </AnimatedSection>
        </section>
    );
}