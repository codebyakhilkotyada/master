import { useState, FormEvent } from "react";
import resumePdf from "@/assets/Akhil-resume.pdf";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Download,
  Send,
  Smartphone,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";
import { toast } from "sonner";
import { usePortfolioData } from "@/hooks/usePortfolioData";

// ── EmailJS Configuration ──
const EMAILJS_SERVICE_ID = "service_b8l1ute";
const EMAILJS_TEMPLATE_ADMIN = "template_iu57cuj";
const EMAILJS_TEMPLATE_CLIENT = "template_pnx56pi";
const EMAILJS_PUBLIC_KEY = "Rbg6gAw7jWQ69oYj8";

const DEFAULT_ADMIN_PHONE = "8317609312";
const DEFAULT_COUNTRY_CODE = "+91";

const ContactSection = () => {
  const { contact } = usePortfolioData() as any;

  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: DEFAULT_COUNTRY_CODE,
    phone: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  // Your real contact details
  const adminEmail =
    "thisisakhilkotyada@gmail.com";

  const adminPhone = "8317609312";

  const adminLinkedin =
    "https://www.linkedin.com/in/akhil-kotyada-5353763ba/";

  const adminGithub =
    "https://github.com/codebyakhilkotyada?tab=repositories";

  const fullPhoneNumber = `${form.countryCode}${form.phone.replace(
    /\D/g,
    ""
  )}`;

  const contactInfo = [
    {
      icon: Mail,
      label: adminEmail,
      href: `mailto:${adminEmail}`,
    },
    {
      icon: Phone,
      label: `${DEFAULT_COUNTRY_CODE} ${adminPhone}`,
      href: `tel:${DEFAULT_COUNTRY_CODE}${adminPhone}`,
    },
    {
      icon: Github,
      label: "github.com/codebyakhilkotyada",
      href: adminGithub,
    },
    {
      icon: Linkedin,
      label: "linkedin.com/in/akhil-kotyada",
      href: adminLinkedin,
    },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    ) {
      return;
    }

    setSending(true);

    try {
      const submittedPhone = form.phone
        ? fullPhoneNumber
        : "Not provided";

      const templateParams = {
        from_name: form.name,
        from_email: form.email,
        from_phone: submittedPhone,
        message: form.message,
        to_email: adminEmail,
      };

      // Send to admin
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ADMIN,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // Auto reply
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_CLIENT,
        {
          to_name: form.name,
          to_email: form.email,
          from_name: "Akhil Kotyada",
          reply_to: adminEmail,
        },
        EMAILJS_PUBLIC_KEY
      );

      toast.success(
        "Message sent successfully! 🚀"
      );

      setForm({
        name: "",
        email: "",
        countryCode: DEFAULT_COUNTRY_CODE,
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="section-padding relative scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase glass-subtle text-primary mb-4">
            Get In Touch
          </span>
        </ScrollReveal>

        <TextReveal
          as="h2"
          className="text-3xl md:text-5xl font-bold mb-10 text-foreground break-words"
          delay={0.1}
        >
          Let's Work Together
        </TextReveal>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Contact Form */}
          <ScrollReveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="glass rounded-xl p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Mobile Number{" "}
                  <span className="text-muted-foreground/60 font-normal">
                    (optional)
                  </span>
                </label>

                <div className="flex gap-2">
                  {/* Country Code */}
                  <select
                    value={form.countryCode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        countryCode: e.target.value,
                      })
                    }
                    className="w-[100px] px-2 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>

                  {/* Number Input */}
                  <div className="relative flex-1">
                    <Smartphone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                    />

                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={
                        form.countryCode === "+91"
                          ? 10
                          : 15
                      }
                      value={form.phone}
                      onChange={(e) => {
                        const onlyDigits =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setForm({
                          ...form,
                          phone: onlyDigits,
                        });
                      }}
                      placeholder={
                        form.countryCode === "+91"
                          ? "9876543210"
                          : "Enter number"
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  required
                  maxLength={1000}
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send size={16} />

                {sending
                  ? "Sending..."
                  : "Let's Work Together"}
              </button>
            </form>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal delay={0.2}>
            <div className="space-y-6">
              <div className="glass rounded-xl p-5 sm:p-6 md:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Contact Info
                </h3>

                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 transition-all duration-300 group-hover:scale-110">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>

                      <span className="text-sm break-all">
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Resume Button */}
             <a
  href={resumePdf}
  download="Akhil-Kotyada-Resume.pdf"
  className="btn-outline-glow w-full flex items-center justify-center gap-2"
>
  <Download size={16} />
  Download Resume
</a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;