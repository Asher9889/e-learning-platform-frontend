import { MODULES } from '@/constants/home/home.constant';
import { AnimatedSection } from './Animatedsection';

export function FeaturesSection() {
    return (
        <section id="features" className="px-10 py-[70px] flex items-center justify-center">
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
                                <p className="text-[14px] leading-[1.65] text-muted-foreground">{desc}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}