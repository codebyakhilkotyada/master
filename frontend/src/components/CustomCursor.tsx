import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 📱 Disable custom cursor on touch devices AND small screens (<768px)
    // to prevent layout jank and unnecessary repaints on mobile.
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    if (isTouchDevice || isSmallScreen) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        animate={{
          x: position.x - (isHovering ? 20 : 10),
          y: position.y - (isHovering ? 20 : 10),
          width: isHovering ? 40 : 20,
          height: isHovering ? 40 : 20,
          opacity: 0.6,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        style={{
          background: "radial-gradient(circle, hsl(172 66% 50% / 0.4), transparent)",
          border: "1px solid hsl(172 66% 50% / 0.5)",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[9999] rounded-full"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 30 }}
        style={{ background: "hsl(172 66% 50%)" }}
      />
    </>
  );
};

export default CustomCursor;
