"use client";

import { useState } from "react";

export default function PreviewFrame({ lang = "en" }) {
  const [isOpen, setIsOpen] = useState(false);

  const t = {
    en: {
      preview: "Live Preview",
      openPreview: "Open Preview",
      closePreview: "Close Preview",
      instruction: "Changes will appear here in real-time after saving",
    },
    zh: {
      preview: "实时预览",
      openPreview: "打开预览",
      closePreview: "关闭预览",
      instruction: "保存后的更改将实时显示在这里",
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          👁️ {t[lang].openPreview}
        </button>
      ) : (
        <div className="w-[400px] rounded-2xl border border-white/10 bg-ink shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div>
              <h3 className="font-semibold text-white">{t[lang].preview}</h3>
              <p className="text-xs text-white/60">{t[lang].instruction}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
            >
              {t[lang].closePreview}
            </button>
          </div>
          <div className="h-[500px] overflow-auto bg-white/5 p-4">
            <iframe
              src="/"
              className="h-full w-full rounded-lg border border-white/10 bg-white"
              title="Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
