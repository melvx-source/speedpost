import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesBand from "@/components/FeaturesBand";
import StepsSection from "@/components/StepsSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <div className="bg-mesh" />
    {/* Blobs */}
    <div className="fixed top-[-100px] right-[200px] w-[500px] h-[500px] rounded-full bg-violet/15 blur-[80px] pointer-events-none z-0" style={{ animation: 'blobDrift 15s ease-in-out infinite alternate' }} />
    <div className="fixed bottom-[100px] right-[100px] w-[350px] h-[350px] rounded-full bg-coral/12 blur-[80px] pointer-events-none z-0" style={{ animation: 'blobDrift 15s ease-in-out infinite alternate', animationDelay: '-6s' }} />

    <Navbar />
    <HeroSection />
    <FeaturesBand />
    <StepsSection />
    <FeaturesSection />
    <PricingSection />
    <TestimonialsSection />
    <CtaSection />
    <Footer />
  </>
);

export default Index;
