export default function AdminInput({ label, value, onChange, placeholder, type = "text", rows }) {
  const baseClasses = "max-w-2xl w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition-all focus:border-gold/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold/20";

  if (type === "textarea" || rows) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-white/80">{label}</label>
        )}
        <textarea
          className={`${baseClasses} resize-none`}
          rows={rows || 4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/80">{label}</label>
      )}
      <input
        type={type}
        className={baseClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
