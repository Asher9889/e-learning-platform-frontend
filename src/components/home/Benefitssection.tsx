import { BENEFITS } from '@/constants/home/home.constant';
import { AnimatedSection } from './Animatedsection';

export function BenefitsSection() {
    return (
        <section id="benefits" className="px-10 py-20 bg-muted/40 dark:bg-muted/20 transition-colors duration-400">
            <div className="max-w-[1100px] mx-auto">
                <AnimatedSection>
                    <p className="text-[12px] font-medium tracking-[2.5px] uppercase mb-2.5 text-blue-700 dark:text-blue-300">
                        Why Choose Us
                    </p>
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
    );
}