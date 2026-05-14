import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) => {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-40px",
  });

  const getInitial = () => {
    switch (direction) {
      case "left":
        return {
          opacity: 0,
          x: -40,
        };

      case "right":
        return {
          opacity: 0,
          x: 40,
        };

      case "none":
        return {
          opacity: 0,
        };

      default:
        return {
          opacity: 0,
          y: 24,
        };
    }
  };

  const getVisible = () => ({
    opacity: 1,
    y: 0,
    x: 0,
  });

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={isInView ? getVisible() : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;