import Navbar from "@/components/features/landing/Navbar";
import HeroSection from "@/components/features/landing/HeroSection";
import HowItWorks from "@/components/features/landing/HowItWorks";
import BenefitsSection from "@/components/features/landing/BenefitsSection";
import WaitlistSection from "@/components/features/landing/WaitlistSection";
import PremiumSection from "@/components/features/landing/PremiumSection";
import FaqSection from "@/components/features/landing/FaqSection";
import CtaSection from "@/components/features/landing/CtaSection";
import Footer from "@/components/features/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <BenefitsSection />
        <PremiumSection />
        <WaitlistSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
