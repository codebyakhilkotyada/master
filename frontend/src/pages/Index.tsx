import { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Navbar onAdminOpen={() => setAdminOpen(true)} />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
      <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
};

export default Index;
