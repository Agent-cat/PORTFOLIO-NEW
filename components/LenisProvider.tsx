"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect to requestAnimationFrame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const hash = link.getAttribute("href");
        if (hash) {
          const element = document.querySelector(hash);
          if (element) {
            lenis.scrollTo(element as HTMLElement, {
              offset: 0,
              duration: 1.5,
            });
          }
        }
      }
    };

    // Handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          lenis.scrollTo(element as HTMLElement, {
            offset: 0,
            duration: 1.5,
          });
        }
      }
    };

    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(() => {
        handleHashChange();
      }, 100);
    }

    // Add event listeners
    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup
    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return <>{children}</>;
}
