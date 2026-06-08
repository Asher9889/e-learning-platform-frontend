import { Button } from '@/components/ui/button';

interface HeroSectionProps {
    scrollTo: (id: string) => void;
}

export function HeroSection({ scrollTo }: HeroSectionProps) {
    return (
        <section className="relative w-full py-10 px-6 text-center flex items-center justify-center gap-10 overflow-hidden bg-transparent">
            {/* Background blobs */}
            <div className="absolute -top-20 left-[10%] w-[420px] h-[420px] rounded-full blur-[80px] pointer-events-none opacity-50 bg-blue-600/10 dark:bg-blue-600/18" />
            <div className="absolute -bottom-10 right-[8%] w-[360px] h-[360px] rounded-full blur-[70px] pointer-events-none opacity-50 bg-cyan-400/8 dark:bg-cyan-400/12" />

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
    );
}