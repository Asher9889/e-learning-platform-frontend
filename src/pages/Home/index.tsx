import { BenefitsSection } from "#components/home/Benefitssection";
import { ClassroomSection } from "#components/home/Classroomsection";
import { ContactSection } from "#components/home/Contactsection";
import { FeaturesSection } from "#components/home/Featuressection";
import { Footer } from "#components/home/Footer";
import { Header } from "#components/home/Header";
import { HeroSection } from "#components/home/Herosection";
import { SecuritySection } from "#components/home/Securitysection";
import { StatsSection } from "#components/home/Statssection";

export default function HomePage() {
    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-background text-foreground min-h-screen font-sans transition-colors duration-400 ease-out overflow-x-hidden">
            <Header />
            <HeroSection scrollTo={scrollTo} />
            <StatsSection />
            <FeaturesSection />
            <ClassroomSection />
            <BenefitsSection />
            <SecuritySection />
            <ContactSection />
            <Footer scrollTo={scrollTo} />
        </div>
    );
}