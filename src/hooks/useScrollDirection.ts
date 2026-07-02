"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollDirectionOptions {
  /** Always show the element regardless of scroll (e.g. mobile) */
  alwaysVisible?: boolean;
  /** Minimum scroll delta before toggling visibility */
  threshold?: number;
  /** Scroll position below which element is always shown */
  topOffset?: number;
}

export function useScrollDirection({
  alwaysVisible = false,
  threshold = 8,
  topOffset = 64,
}: UseScrollDirectionOptions = {}) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function update() {
      const currentY = window.scrollY;

      if (alwaysVisible || currentY <= topOffset) {
        setVisible(true);
      } else if (currentY - lastScrollY.current > threshold) {
        setVisible(false);
      } else if (lastScrollY.current - currentY > threshold) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysVisible, threshold, topOffset]);

  return visible;
}

export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);

    function onChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
    }

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}
