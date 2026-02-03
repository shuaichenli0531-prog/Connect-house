export default function AdminNav({ active, onSelect, lang = "en" }) {
  const labels = {
    en: {
      site: "Site",
      programs: "Programs",
      insights: "Insights",
      partners: "Partners",
      pastEvents: "Past Events",
    },
    zh: {
      site: "站点配置",
      programs: "项目活动",
      insights: "洞察文章",
      partners: "合作伙伴",
      pastEvents: "历史活动",
    },
  };

  const items = [
    { id: "site", label: labels[lang].site },
    { id: "programs", label: labels[lang].programs },
    { id: "insights", label: labels[lang].insights },
    { id: "partners", label: labels[lang].partners },
    { id: "pastEvents", label: labels[lang].pastEvents },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
            active === item.id
              ? "bg-gradient-to-r from-gold/20 to-gold/10 text-gold shadow-lg ring-1 ring-gold/30"
              : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
