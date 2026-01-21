export default function ProgramCard({ item, applyLabel = "Apply", lang = "en" }) {
  // 项目类型翻译
  const typeTranslations = {
    "FELLOWSHIP": { en: "FELLOWSHIP", zh: "会员项目" },
    "SALON": { en: "SALON", zh: "沙龙" },
    "ACCELERATOR": { en: "ACCELERATOR", zh: "加速器" },
    "SUMMIT": { en: "SUMMIT", zh: "峰会" },
    "WORKSHOP": { en: "WORKSHOP", zh: "工作坊" },
  };

  const getTypeLabel = (type) => {
    const translation = typeTranslations[type?.toUpperCase()];
    return translation ? translation[lang] : type;
  };

  return (
    <div className="card group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {item.imageUrl && (
        <div className="relative h-56 w-full overflow-hidden">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="badge transition-colors group-hover:border-gold group-hover:text-gold">
            {getTypeLabel(item.type)}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">{item.date}</span>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white transition-colors group-hover:text-gold">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-white/70">{item.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
          <span>{item.location}</span>
          <a href={item.link} className="text-gold transition-all hover:translate-x-1 hover:text-gold/80">
            {applyLabel} →
          </a>
        </div>
      </div>
    </div>
  );
}
