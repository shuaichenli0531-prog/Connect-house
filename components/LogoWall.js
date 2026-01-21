"use client";

import { useEffect, useRef } from "react";

export default function LogoWall({ partners }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 20);

    return () => clearInterval(intervalId);
  }, []);

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-ink to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-ink to-transparent" />

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden"
        style={{ scrollBehavior: "auto" }}
      >
        {duplicatedPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="card flex min-w-[200px] items-center justify-center p-6 transition-transform hover:scale-105"
          >
            {partner.logoUrl ? (
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-12 w-auto"
              />
            ) : (
              <span className="text-sm uppercase tracking-[0.3em] text-white/60">
                {partner.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
