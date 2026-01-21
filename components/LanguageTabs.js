export default function LanguageTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 rounded-lg bg-white/5 p-1">
      <button
        onClick={() => onChange("en")}
        className={`rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
          active === "en"
            ? "bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-300 shadow-lg ring-1 ring-blue-400/30"
            : "text-white/50 hover:bg-white/10 hover:text-white/80"
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => onChange("zh")}
        className={`rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
          active === "zh"
            ? "bg-gradient-to-r from-red-500/20 to-red-400/20 text-red-300 shadow-lg ring-1 ring-red-400/30"
            : "text-white/50 hover:bg-white/10 hover:text-white/80"
        }`}
      >
        🇨🇳 ZH
      </button>
    </div>
  );
}
