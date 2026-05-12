import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Brain, Workflow, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";

const skills = [
  { name: "CSS", level: 90 },
  { name: "HTML", level: 85 },
  { name: "React.js", level: 82 },
  { name: "Bootstrap", level: 80 },
  { name: "Tailwind CSS", level: 75 },
  { name: "Sass/SCSS", level: 73 },
  { name: "SEO", level: 72 },
  { name: "EmailJS", level: 70 },
  { name: "JavaScript", level: 60 },
];

const aiSkills = [
  { icon: Brain, label: "AI-Assisted Development", desc: "Leveraging AI tools to accelerate development and deliver smarter solutions." },
  { icon: Workflow, label: "Smart Automation Workflows", desc: "Building automated pipelines that save time and reduce errors." },
  { icon: Sparkles, label: "Intelligent UI/UX Enhancement", desc: "Using AI-driven insights to craft intuitive and engaging user interfaces." },
];

const AnimatedCounter = ({ target, isInView }: { target: number; isInView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }
    let cancelled = false;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => { cancelled = true; };
  }, [isInView, target]);

  return <span>{count}%</span>;
};

const SkillBar = ({ name, level, index }: { name: string; level: number; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20px" });

  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-sm font-mono text-primary">
          <AnimatedCounter target={level} isInView={isInView} />
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full progress-glow"
          style={{ background: "var(--gradient-primary)" }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase glass-subtle text-primary mb-4">
            Skills & Expertise
          </span>
        </ScrollReveal>

        <TextReveal as="h2" className="text-3xl md:text-5xl font-bold mb-12 text-foreground" delay={0.1}>
          Technologies I Work With
        </TextReveal>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <ScrollReveal delay={0.1}>
              <div className="glass rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Development Skills</h3>
              </div>
            </ScrollReveal>
            <div className="glass rounded-xl p-6 md:p-8 -mt-px rounded-t-none border-t-0">
              {skills.map((skill, i) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} index={i} />
              ))}
            </div>
          </div>

          <ScrollReveal delay={0.2}>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">AI & Innovation</h3>
              {aiSkills.map((skill, i) => (
                <ScrollReveal key={skill.label} delay={0.1 * (i + 1)}>
                  <div className="glass rounded-xl p-6 hover:glow-border transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-accent/15">
                        <skill.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{skill.label}</h4>
                        <p className="text-sm text-muted-foreground">{skill.desc}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
