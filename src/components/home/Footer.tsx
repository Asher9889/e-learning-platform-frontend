import { Button } from '@/components/ui/button';

interface HomeFooterProps {
    scrollTo: (id: string) => void;
}

export function Footer({ scrollTo }: HomeFooterProps) {
    return (
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
    );
}