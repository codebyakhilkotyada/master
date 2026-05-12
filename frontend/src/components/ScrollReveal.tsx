import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });

  const getInitial = () => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -50, clipPath: "inset(0 100% 0 0)" };
      case "right":
        return { opacity: 0, x: 50, clipPath: "inset(0 0 0 100%)" };
      case "none":
        return { opacity: 0, clipPath: "inset(0 100% 0 0)" };
      default:
        return { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" };
    }
  };

  const getVisible = () => ({
    opacity: 1,
    y: 0,
    x: 0,
    clipPath: "inset(0 0% 0 0)",
  });

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={isInView ? getVisible() : getInitial()}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
