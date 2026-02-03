export default function VisibilityToggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{checked ? '👁️' : '🙈'}</span>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-white/60">
            {checked ? 'Section is visible on the website' : 'Section is hidden from the website'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-14 rounded-full transition-all ${
          checked ? 'bg-gold' : 'bg-white/20'
        }`}
      >
        <div
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-8' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}
