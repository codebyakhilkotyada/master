import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const TextReveal = ({ children, className = "", delay = 0, as: Tag = "p" }: TextRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
        animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" } : {}}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
};

export default TextReveal;
