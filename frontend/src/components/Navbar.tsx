import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  onAdminOpen: () => void;
}

const ADMIN_PASSWORD = "akhil2024";

const Navbar = ({ onAdminOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [typedChars, setTypedChars] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const SECRET_WORD = "akhil";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Secret admin trigger
  useEffect(() => {
    if (!isHovering) {
      setTypedChars("");
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const newTyped = typedChars + e.key.toLowerCase();

      setTypedChars(newTyped);

      if (newTyped.endsWith(SECRET_WORD)) {
        setTypedChars("");
        setShowPasswordModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [isHovering, typedChars]);

  const handlePasswordSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setShowPasswordModal(false);
      setPassword("");
      onAdminOpen();
    } else {
      setPassword("");
      alert("Incorrect password");
    }
  };

  // Prevent body scroll on mobile menu
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.5,
        }}
        className={`fixed top-0 left-0 right-0 z-[99999] transition-all duration-300 ${
          scrolled
            ? "glass py-3"
            : "py-3 sm:py-4 md:py-5"
        }`}
        style={{
          pointerEvents: "auto",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setTypedChars("");
            }}
            onClick={(e) => e.preventDefault()}
            className="text-xl sm:text-2xl font-bold text-gradient cursor-pointer select-none relative z-[99999]"
          >
            AK
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#contact"
              className="btn-primary text-sm px-5 py-2"
            >
              Let's Talk
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="md:hidden relative z-[99999] text-foreground"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden relative z-[99999] mt-3 px-3 sm:px-4">
            <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-border/40">
              <div className="flex flex-col p-5 gap-5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}

                <a
                  href="#contact"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="btn-primary text-sm text-center px-6 py-2"
                >
                  Let's Talk
                </a>
              </div>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          onClick={() => {
            setShowPasswordModal(false);
            setPassword("");
          }}
        >
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            className="glass rounded-2xl p-6 sm:p-8 w-full max-w-sm"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h3 className="text-lg font-bold text-foreground mb-4">
              Admin Access
            </h3>

            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter admin password"
                autoFocus
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm mb-4"
              />

              <button
                type="submit"
                className="btn-primary w-full text-sm py-2.5"
              >
                Unlock
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Navbar;