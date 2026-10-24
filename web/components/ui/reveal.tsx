"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper. Elements fade and rise into place once, the first time
 * they enter the viewport. Motion is skipped entirely when the visitor asks for
 * reduced motion, and content is visible immediately if IntersectionObserver is
 * unavailable.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      data-reveal={shown ? "in" : "out"}
      style={
        shown && !reduced
          ? { transitionDelay: `${delay}ms` }
          : undefined
      }
      className={`reveal ${className}`}
    >
      {children}
    </Component>
  );
}
