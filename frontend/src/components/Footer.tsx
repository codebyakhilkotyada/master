import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Akhil Kotyada. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          {[
            { icon: Github, href: "https://github.com/akhilkotyada", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com/in/akhilkotyada", label: "LinkedIn" },
            { icon: Mail, href: "mailto:thisisakhilkotyada@gmail.com", label: "Email" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-300"
            >
              <social.icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
