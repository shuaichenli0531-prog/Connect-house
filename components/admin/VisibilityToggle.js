export default function VisibilityToggle({ label, checked, onChange }) {
  return (
    <div className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-all ${
      checked
        ? "border-gold/30 bg-gold/10 shadow-lg shadow-gold/5"
        : "border-white/10 bg-white/5"
    }`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-all ${
          checked ? "bg-gold/20 text-gold" : "bg-white/10 text-white/60"
        }`}>
          {checked ? "👁️" : "🙈"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="mt-1 text-xs text-white/55">
            {checked ? "Visible on website" : "Hidden from website"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-gold/30 ${
          checked
            ? "border-gold/60 bg-gold shadow-lg shadow-gold/20"
            : "border-white/15 bg-white/15"
        }`}
      >
        <div
          className={`absolute top-0.5 h-5.5 w-5.5 rounded-full bg-white shadow-md transition-all ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
          style={{ left: "2px" }}
        />
      </button>
    </div>
  );
}
