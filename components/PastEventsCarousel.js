"use client";

import { useState, useEffect } from "react";

export default function PastEventsCarousel({ events = [], lang = "en" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 自动播放
  useEffect(() => {
    if (!isAutoPlaying || events.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000); // 5秒切换一次

    return () => clearInterval(timer);
  }, [isAutoPlaying, events.length]);

  if (events.length === 0) {
    return null;
  }

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full">
      {/* 轮播主体 */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink/50">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentIndex
                ? "translate-x-0 opacity-100"
                : index < currentIndex
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
            }`}
          >
            {/* 背景图片 */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
            </div>

            {/* 内容 */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              {event.date && (
                <p className="text-xs uppercase tracking-[0.3em] text-gold">
                  {event.date}
                </p>
              )}
              <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                {lang === "en" ? event.titleEn : event.titleZh}
              </h3>
              {(event.descEn || event.descZh) && (
                <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
                  {lang === "en" ? event.descEn : event.descZh}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* 左右箭头 */}
        {events.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20"
              aria-label="Previous"
            >
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20"
              aria-label="Next"
            >
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 指示器 */}
      {events.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-gold"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
