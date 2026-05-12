import { Globe, Layout, User, Building2, RefreshCw, Bug, Search } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";

const services = [
  { icon: Globe, title: "Website Development", desc: "Custom-built, high-performance websites tailored to your business goals." },
  { icon: Layout, title: "Landing Page Design", desc: "Conversion-optimized landing pages that capture leads and drive action." },
  { icon: User, title: "Portfolio Websites", desc: "Stunning personal portfolios that showcase your work and attract clients." },
  { icon: Building2, title: "Business Websites", desc: "Professional web presence for businesses that builds credibility and trust." },
  { icon: RefreshCw, title: "Website Redesign", desc: "Modernize and revitalize your existing website for better performance." },
  { icon: Bug, title: "Bug Fixing", desc: "Quick diagnosis and resolution of website issues and broken functionality." },
  { icon: Search, title: "SEO Optimization", desc: "Improve your search rankings and organic visibility with proven strategies." },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase glass-subtle text-primary mb-4">
            What I Offer
          </span>
        </ScrollReveal>

        <TextReveal as="h2" className="text-3xl md:text-5xl font-bold mb-12 text-foreground" delay={0.1}>
          Services That Deliver Results
        </TextReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={0.05 * (i + 1)}>
              <div className="glass rounded-xl p-6 hover:glow-border transition-all duration-500 group hover:-translate-y-1 h-full">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 bg-primary/10 transition-all duration-300 group-hover:scale-110">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
