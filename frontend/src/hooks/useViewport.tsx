import { useEffect, useState } from "react";

export type DeviceClass = "mobile" | "tablet" | "laptop" | "desktop" | "ultrawide";

export interface ViewportInfo {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: "portrait" | "landscape";
  isTouch: boolean;
  device: DeviceClass;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isUltrawide: boolean;
  isFold: boolean;
}

const compute = (): ViewportInfo => {
  if (typeof window === "undefined") {
    return {
      width: 1280,
      height: 720,
      aspectRatio: 16 / 9,
      orientation: "landscape",
      isTouch: false,
      device: "laptop",
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isUltrawide: false,
      isFold: false,
    };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const aspect = w / Math.max(h, 1);
  const orientation: "portrait" | "landscape" = w >= h ? "landscape" : "portrait";
  const isTouch =
    "ontouchstart" in window || (navigator as any).maxTouchPoints > 0;

  let device: DeviceClass = "desktop";
  if (w < 480) device = "mobile";
  else if (w < 768) device = "mobile";
  else if (w < 1024) device = "tablet";
  else if (w < 1440) device = "laptop";
  else if (w < 1920) device = "desktop";
  else device = "ultrawide";

  // Galaxy Fold (~280px) and similar narrow folds
  const isFold = w <= 320;

  return {
    width: w,
    height: h,
    aspectRatio: aspect,
    orientation,
    isTouch,
    device,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop" || device === "laptop" || device === "ultrawide",
    isUltrawide: device === "ultrawide",
    isFold,
  };
};

/**
 * Dynamic viewport hook — recalculates on resize & orientationchange so layouts
 * can adapt instantly when DevTools switches between iPhone, Galaxy, Pixel,
 * iPad, Fold, ultrawide, etc.
 */
export const useViewport = (): ViewportInfo => {
  const [vp, setVp] = useState<ViewportInfo>(() => compute());

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp(compute()));
    };
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return vp;
};

export default useViewport;