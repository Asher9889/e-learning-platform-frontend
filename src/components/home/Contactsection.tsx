import { Button } from '@/components/ui/button';
import { AnimatedSection } from './Animatedsection';

export function ContactSection() {
    return (
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
    );
}