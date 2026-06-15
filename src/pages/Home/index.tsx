import { Header } from "#components/home/Header";
import { HeroSection } from "#components/home/Herosection";
import { StatsSection } from "#components/home/Statssection";
import { FeaturesSection } from "#components/home/Featuressection";
import { DifferentiatorsSection } from "#components/home/Differentiatorssection";
import { ClassroomSection } from "#components/home/Classroomsection";
import { BenefitsSection } from "#components/home/Benefitssection";
import { ContactSection } from "#components/home/Contactsection";
import { Footer } from "#components/home/Footer";
import "./superr.css";

export default function HomePage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="superr" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <Header />
      <HeroSection scrollTo={scrollTo} />
      <StatsSection />
      <FeaturesSection />
      <DifferentiatorsSection />
      <ClassroomSection />
      <BenefitsSection />
      <ContactSection scrollTo={scrollTo} />
      <Footer scrollTo={scrollTo} />
    </div>
  );
}
