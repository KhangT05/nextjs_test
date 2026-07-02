"use client";

import { useEffect } from "react";
import { initScrollTracking, track } from "@/lib/analytics";
import { useScrollToast } from "./ScrollToast";

/**
 * No render output — pure side-effect component. Kept separate from
 * page.tsx so the page itself stays a Server Component; this is the
 * only piece that genuinely needs the client runtime at page level.
 */
export function ScrollTracker() {
  const { pushToast } = useScrollToast();

  useEffect(() => {
    const cleanupScroll = initScrollTracking((depth) => {
      pushToast(depth);
    });

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) track({ type: "section_view", section: e.target.id }); }),
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));

    return () => { cleanupScroll(); observer.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
