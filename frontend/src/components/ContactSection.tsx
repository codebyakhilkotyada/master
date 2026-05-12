import { useState, FormEvent } from "react";
import { Mail, Phone, Github, Linkedin, Download, Send, Smartphone } from "lucide-react";
import emailjs from "@emailjs/browser";
import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";
import { toast } from "sonner";
import { usePortfolioData } from "@/hooks/usePortfolioData";

// ── EmailJS Configuration ──
const EMAILJS_SERVICE_ID = "service_b8l1ute";
const EMAILJS_TEMPLATE_ADMIN = "template_iu57cuj";    // Admin receives client details
const EMAILJS_TEMPLATE_CLIENT = "template_pnx56pi";   // Auto-reply to client
const EMAILJS_PUBLIC_KEY = "Rbg6gAw7jWQ69oYj8";
const DEFAULT_ADMIN_PHONE = "8317609312";
const DEFAULT_COUNTRY_CODE = "91";

const toWhatsappNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  // Always ensure country code prefix
  if (digits.length === 10) return `${DEFAULT_COUNTRY_CODE}${digits}`;
  if (digits.length === 12 && digits.startsWith(DEFAULT_COUNTRY_CODE)) return digits;
  if (digits.length > 10) return digits;
  return `${DEFAULT_COUNTRY_CODE}${digits}`;
};

const ContactSection = () => {
  const { contact } = usePortfolioData() as any;
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const adminEmail = contact.email.trim() || "thisisakhilkotyada@gmail.com";
  const adminPhone = contact.phone.trim() && contact.phone.trim() !== "+1 (234) 567-890"
    ? contact.phone.trim()
    : DEFAULT_ADMIN_PHONE;
  const adminPhoneDigits = adminPhone.replace(/\D/g, "") || DEFAULT_ADMIN_PHONE;
  const adminWhatsappNumber = toWhatsappNumber(adminPhone);
  const adminWhatsappLink = `https://wa.me/+${adminWhatsappNumber}`;

  const adminPhoneDisplay = adminPhoneDigits.length === 10
    ? `+${DEFAULT_COUNTRY_CODE} ${adminPhoneDigits}`
    : adminPhoneDigits.length > 10
      ? `+${adminPhoneDigits}`
      : `+${DEFAULT_COUNTRY_CODE} ${adminPhoneDigits}`;

  const contactInfo = [
    { icon: Mail, label: adminEmail, href: `mailto:${adminEmail}` },
    { icon: Phone, label: adminPhoneDisplay, href: `tel:+${adminWhatsappNumber}` },
    { icon: Github, label: contact.github.replace("https://", ""), href: contact.github },
    { icon: Linkedin, label: contact.linkedin.replace("https://", ""), href: contact.linkedin },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);

    try {
      const submittedPhone = form.phone.trim() || "Not provided";
      const clientPhoneDigits = submittedPhone === "Not provided" ? "" : submittedPhone.replace(/\D/g, "");
      const clientWhatsappNumber = submittedPhone === "Not provided" ? "" : toWhatsappNumber(submittedPhone);
      const clientWhatsappLink = clientWhatsappNumber ? `https://wa.me/+${clientWhatsappNumber}` : "";
      const clientEmailLink = `mailto:${form.email}`;
      const adminEmailLink = `mailto:${adminEmail}`;
      const clientDetails = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Phone: ${submittedPhone}`,
        `Message: ${form.message}`,
      ].join("\n");

      const adminTemplateParams = {
        from_name: form.name,
        from_email: form.email,
        from_phone: submittedPhone,
        name: form.name,
        email: form.email,
        phone: submittedPhone,
        mobile: submittedPhone,
        mobile_number: submittedPhone,
        client_name: form.name,
        client_email: form.email,
        client_phone: submittedPhone,
        user_name: form.name,
        user_email: form.email,
        user_phone: submittedPhone,
        message: form.message,
        client_message: form.message,
        user_message: form.message,
        reply_to: form.email,
        reply_email: form.email,
        reply_email_link: clientEmailLink,
        email_link: clientEmailLink,
        mailto_link: clientEmailLink,
        to_email: adminEmail,
        admin_email: adminEmail,
        admin_phone: adminPhone,
        phone_link: clientPhoneDigits ? `tel:${clientPhoneDigits}` : "",
        whatsapp_number: clientWhatsappNumber || adminWhatsappNumber,
        whatsapp_link: clientWhatsappLink || adminWhatsappLink,
        whatsapp_url: clientWhatsappLink || adminWhatsappLink,
        client_whatsapp_number: clientWhatsappNumber,
        client_whatsapp_link: clientWhatsappLink,
        admin_whatsapp_number: adminWhatsappNumber,
        admin_whatsapp_link: adminWhatsappLink,
        client_details: clientDetails,
        client_summary: clientDetails,
        client_details_html: clientDetails.replace(/\n/g, "<br />"),
      };

      // Send to admin (you receive the client's details)
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ADMIN,
        adminTemplateParams,
        EMAILJS_PUBLIC_KEY
      );

      // Send auto-reply to client
      try {
        const clientTemplateParams = {
          to_name: form.name,
          to_email: form.email,
          email: form.email,
          user_email: form.email,
          client_email: form.email,
          recipient_email: form.email,
          name: form.name,
          client_name: form.name,
          user_name: form.name,
          from_name: "Akhil Kotyada",
          from_email: adminEmail,
          reply_to: adminEmail,
          reply_email: adminEmail,
          reply_email_link: adminEmailLink,
          email_link: adminEmailLink,
          mailto_link: adminEmailLink,
          admin_email: adminEmail,
          admin_phone: adminPhone,
          contact_phone: adminPhone,
          phone: submittedPhone,
          from_phone: submittedPhone,
          client_phone: submittedPhone,
          submitted_phone: submittedPhone,
          message: form.message,
          client_message: form.message,
          submitted_message: form.message,
          whatsapp_number: adminWhatsappNumber,
          whatsapp_link: adminWhatsappLink,
          whatsapp_url: adminWhatsappLink,
          admin_whatsapp_number: adminWhatsappNumber,
          admin_whatsapp_link: adminWhatsappLink,
          client_whatsapp_number: clientWhatsappNumber,
          client_whatsapp_link: clientWhatsappLink,
          client_details: clientDetails,
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_CLIENT,
          clientTemplateParams,
          EMAILJS_PUBLIC_KEY
        );
      } catch (autoReplyError) {
        console.warn("Auto-reply failed (check EmailJS template recipient mapping):", autoReplyError);
      }

      toast.success("Message sent successfully! I'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error("Failed to send message. Please try again or email me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase glass-subtle text-primary mb-4">
            Get In Touch
          </span>
        </ScrollReveal>

        <TextReveal as="h2" className="text-3xl md:text-5xl font-bold mb-10 text-foreground" delay={0.1}>
          Let's Work Together
        </TextReveal>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10">
          <ScrollReveal delay={0.1}>
            <form onSubmit={handleSubmit} className="glass rounded-xl p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input id="name" type="text" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input id="email" type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  Mobile Number <span className="text-muted-foreground/60 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input id="phone" type="tel" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea id="message" required maxLength={1000} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project..." className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm resize-none" />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                <Send size={16} />
                {sending ? "Sending..." : "Let's Work Together"}
              </button>
            </form>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-6">
              <div className="glass rounded-xl p-5 sm:p-6 md:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Contact Info</h3>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 transition-all duration-300 group-hover:scale-110">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm break-all">{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
              <a href="#" className="btn-outline-glow w-full flex items-center justify-center gap-2" download>
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
