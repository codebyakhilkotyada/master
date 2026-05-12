import { ExternalLink, Github } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";
import ProjectImageCarousel from "./ProjectImageCarousel";
import { usePortfolioData } from "@/hooks/usePortfolioData";

import ecommerce1 from "@/assets/projects/ecommerce-1.jpg";
import ecommerce2 from "@/assets/projects/ecommerce-2.jpg";
import ecommerce3 from "@/assets/projects/ecommerce-3.jpg";
import saas1 from "@/assets/projects/saas-1.jpg";
import saas2 from "@/assets/projects/saas-2.jpg";
import saas3 from "@/assets/projects/saas-3.jpg";
import portfolio1 from "@/assets/projects/portfolio-1.jpg";
import portfolio2 from "@/assets/projects/portfolio-2.jpg";
import portfolio3 from "@/assets/projects/portfolio-3.jpg";

const defaultProjects = [
  {
    title: "E-Commerce Platform",
    description: "A modern, fully responsive e-commerce website with seamless checkout flow and optimized performance for maximum conversions.",
    tags: ["React", "Tailwind CSS", "Stripe", "Node.js"],
    live_url: "#",
    github_url: "#",
    images: [ecommerce1, ecommerce2, ecommerce3],
  },
  {
    title: "SaaS Landing Page",
    description: "High-converting landing page for a SaaS startup featuring animated sections, testimonials, and integrated lead capture forms.",
    tags: ["HTML", "CSS", "JavaScript", "GSAP"],
    live_url: "#",
    github_url: "#",
    images: [saas1, saas2, saas3],
  },
  {
    title: "Portfolio Website",
    description: "A premium portfolio for a creative professional with smooth scroll animations, dynamic content, and mobile-first design.",
    tags: ["React", "Framer Motion", "Tailwind CSS"],
    live_url: "#",
    github_url: "#",
    images: [portfolio1, portfolio2, portfolio3],
  },
];

const ProjectsSection = () => {
  const { projects: adminProjects } = usePortfolioData() as any;

  // Merge default + admin projects
  const allProjects = [
    ...defaultProjects,
    ...adminProjects.filter((p) => p.title && p.images.length > 0),
  ];

  return (
    <section id="projects" className="section-padding relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase glass-subtle text-primary mb-4">
            Featured Work
          </span>
        </ScrollReveal>

        <TextReveal as="h2" className="text-3xl md:text-5xl font-bold mb-12 text-foreground" delay={0.1}>
          Projects I've Built
        </TextReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {allProjects.map((project, i) => (
            <ScrollReveal key={project.title + i} delay={0.1 * (i + 1)}>
              <div className="glass rounded-xl overflow-hidden group hover:glow-border transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                <div className="h-40 sm:h-48 relative overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    loading="lazy"
                    width={800}
                    height={512}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center gap-3 sm:gap-4">
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink size={14} /> Live Site
                    </a>
                    <ProjectImageCarousel images={project.images} title={project.title} />
                  </div>
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-4 flex-1">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2 sm:px-2.5 py-1 rounded-md bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <a
                      href={project.live_url}
                      className="btn-primary text-xs px-3 sm:px-4 py-2 flex items-center gap-1.5"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                    <a
                      href={project.github_url}
                      className="btn-outline-glow text-xs px-3 sm:px-4 py-2 flex items-center gap-1.5"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={14} /> GitHub
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
