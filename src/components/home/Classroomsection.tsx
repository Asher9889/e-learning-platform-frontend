import { AnimatedSection } from './Animatedsection';

const CLASSROOM_FEATURES = [
    { icon: '🎙️', text: 'Live video lectures with HD quality' },
    { icon: '🖥️', text: 'Screen sharing and presentation mode' },
    { icon: '💬', text: 'Real-time chat and interactive Q&A' },
    { icon: '⏺️', text: 'Session recording for replay anytime' },
    { icon: '📅', text: 'Scheduled classes with reminders' },
];

export function ClassroomSection() {
    return (
        <section id="classroom" className="px-10 py-20">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                {/* Text */}
                <AnimatedSection>
                    <p className="text-[12px] font-medium tracking-[2.5px] uppercase mb-2.5 text-blue-700 dark:text-blue-300">
                        Virtual Classroom
                    </p>
                    <h2 className="font-['Syne',_sans-serif] text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold text-foreground mb-4 leading-[1.2]">
                        Live Classes That Feel Real
                    </h2>
                    <p className="text-[15px] text-muted-foreground leading-[1.7] mb-8">
                        Our virtual classroom brings the energy of a real class online. Teachers can share their screen, answer questions live, and keep students engaged — all in your browser.
                    </p>

                    {CLASSROOM_FEATURES.map(({ icon, text }) => (
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
    );
}