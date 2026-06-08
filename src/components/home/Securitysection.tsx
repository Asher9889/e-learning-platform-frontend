import { SECURITY_FEATURES } from '@/constants/home/home.constant';
import { AnimatedSection } from './Animatedsection';

export function SecuritySection() {
    return (
        <section id="security" className="px-10 py-20">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <AnimatedSection>
                    <p className="text-[12px] font-medium tracking-[2.5px] uppercase mb-2.5 text-blue-700 dark:text-blue-300">
                        Security & Trust
                    </p>
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
    );
}