import { Code2, Zap, Target } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";

const highlights = [
  { icon: Code2, label: "Clean Code", desc: "Modular, maintainable, and scalable" },
  { icon: Zap, label: "Fast Performance", desc: "Optimized for speed and conversions" },
  { icon: Target, label: "Goal-Oriented", desc: "Built to attract and convert clients" },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase glass-subtle text-primary mb-4">
            About Me
          </span>
        </ScrollReveal>

        <TextReveal as="h2" className="text-3xl md:text-5xl font-bold mb-6 text-foreground" delay={0.1}>
          Crafting Digital Experiences That Convert
        </TextReveal>

        <TextReveal as="p" className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed mb-12" delay={0.2}>
          I'm a freelance web developer specializing in building fast, modern, and conversion-focused websites. I partner with businesses and entrepreneurs to create digital experiences that not only look stunning but drive real results — more leads, more clients, more growth.
        </TextReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item, i) => (
            <ScrollReveal key={item.label} delay={0.1 * (i + 1)}>
              <div className="glass rounded-xl p-6 hover:glow-border transition-all duration-500 group">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.label}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
