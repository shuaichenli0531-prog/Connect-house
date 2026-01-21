export default function ModernAdminSection({
  icon,
  title,
  description,
  children,
  accent = "gold",
  languageTabs = null,
  cardTabs = null
}) {
  const accentColors = {
    gold: "from-gold/20 to-gold/5 border-gold/30",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    green: "from-green-500/20 to-green-500/5 border-green-500/30",
  };

  return (
    <div className="group relative max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition-all hover:border-white/20 hover:shadow-2xl">
      {/* 背景装饰 */}
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-gold/10 to-transparent blur-3xl transition-all group-hover:translate-x-4 group-hover:-translate-y-4" />

      <div className="relative">
        {/* 卡片切换 Tab - 如果有的话，放在最顶部 */}
        {cardTabs && (
          <div className="border-b border-white/10 bg-black/20 px-8 pt-6 pb-2">
            {cardTabs}
          </div>
        )}

        {/* 主内容区域 */}
        <div className="space-y-6 p-8">
          {/* 标题区域 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {icon && (
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentColors[accent]} text-2xl transition-transform group-hover:scale-110`}>
                  {icon}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                {description && (
                  <p className="mt-1 text-sm text-white/60">{description}</p>
                )}
              </div>
            </div>

            {/* 语言切换 Tab */}
            {languageTabs && (
              <div className="shrink-0 pt-1">
                {languageTabs}
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
