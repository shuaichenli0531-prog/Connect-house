"use client";

export default function LanguageToggle({ lang, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-xs uppercase tracking-[0.25em]">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`px-3 py-1 ${lang === "en" ? "text-gold" : "text-white/60"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("zh")}
        className={`px-3 py-1 ${lang === "zh" ? "text-gold" : "text-white/60"}`}
      >
        中文
      </button>
    </div>
  );
}
