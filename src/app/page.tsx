import Navbar from "@/components/features/landing/Navbar";
import HeroSection from "@/components/features/landing/HeroSection";
import HowItWorks from "@/components/features/landing/HowItWorks";
import BenefitsSection from "@/components/features/landing/BenefitsSection";
import ReassuranceSection from "@/components/features/landing/ReassuranceSection";
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
        <ReassuranceSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
