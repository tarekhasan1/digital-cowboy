"use client";

import { useEffect, useRef } from "react";

/**
 * A radial glow that follows the cursor. Desktop-only by design: gated on
 * `(hover: hover) and (pointer: fine)` so it never attaches a listener (and
 * is never rendered) on touch devices — zero cost on mobile/tablet.
 * Updates a CSS custom property directly via the DOM rather than React
 * state, so mouse movement never triggers a re-render.
 */
export default function CursorGlow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--glow-x", `${x}%`);
      el.style.setProperty("--glow-y", `${y}%`);
      el.style.opacity = "1";
    };

    const handleLeave = () => {
      el.style.opacity = "0";
    };

    const parent = el.parentElement;
    parent?.addEventListener("mousemove", handleMove);
    parent?.addEventListener("mouseleave", handleLeave);
    return () => {
      parent?.removeEventListener("mousemove", handleMove);
      parent?.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`hidden [@media(hover:hover)_and_(pointer:fine)]:block absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 ${className}`}
      style={{
        background:
          "radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,255,255,0.06), transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}
