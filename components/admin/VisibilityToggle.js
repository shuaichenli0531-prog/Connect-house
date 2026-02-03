export default function VisibilityToggle({ label, checked, onChange }) {
  return (
    <div className="inline-flex max-w-md items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{checked ? '👁️' : '🙈'}</span>
        <p className="text-sm font-medium text-white">{label}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative ml-6 h-6 w-11 shrink-0 rounded-full transition-all ${
          checked ? 'bg-gold' : 'bg-white/20'
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-5.5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
