import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectImageCarouselProps {
  images: string[];
  title: string;
}

const ProjectImageCarousel = ({ images, title }: ProjectImageCarouselProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const count = images.length;

  const next = useCallback(() => {
    setDirection(1);
    setActiveIndex((p) => (p + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((p) => (p - 1 + count) % count);
  }, [count]);

  // Auto-slide every 2s
  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [isOpen, next]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, next, prev]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <>
      <button
        onClick={() => { setActiveIndex(0); setIsOpen(true); }}
        className="text-xs font-medium px-3 py-1.5 rounded-md bg-secondary/80 text-foreground hover:bg-secondary transition-colors"
      >
        Demo Images
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground text-2xl font-bold z-10"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* Arrows */}
            <button
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Swipe carousel */}
            <div
              className="relative w-[85vw] max-w-3xl aspect-video overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={activeIndex}
                  src={images[activeIndex]}
                  alt={`${title} screenshot ${activeIndex + 1}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) next();
                    else if (info.offset.x > 50) prev();
                  }}
                />
              </AnimatePresence>

              {/* Counter */}
              <div className="absolute top-3 left-3 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <p className="text-xs font-mono text-foreground">{activeIndex + 1} / {count}</p>
              </div>
              <div className="absolute bottom-3 left-3 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <p className="text-sm font-semibold text-foreground">{title}</p>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-8 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(i > activeIndex ? 1 : -1);
                    setActiveIndex(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === i ? "bg-primary scale-125" : "bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectImageCarousel;
