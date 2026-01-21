"use client";

import Image from "next/image";

export default function LivePreview({ section, data, lang = "en" }) {
  // 如果是 site 页面，显示所有区域的预览
  if (section === "site" && data.brand && data.hero && data.about) {
    return (
      <div className="space-y-6">
        {/* Brand 预览 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
            {lang === "en" ? "Brand (Header & Footer)" : "品牌（页头和页脚）"}
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg border border-white/10 bg-ink p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h1 className="text-xl font-bold text-gold">{data.brand.name || "Brand Name"}</h1>
                <div className="flex gap-4 text-xs text-white/70">
                  <span>About</span>
                  <span>Programs</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-ink p-3 text-center">
              <p className="text-xs text-white/60">{data.brand.tagline || "Tagline"}</p>
            </div>
          </div>
        </div>

        {/* Hero 预览 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
            {lang === "en" ? "Hero Section" : "首页主视觉"}
          </h3>
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink via-ink/95 to-gold/10 p-8 text-center">
            <div className="relative z-10 space-y-4">
              <h1 className="text-3xl font-bold leading-tight text-white">
                {data.hero.headline || "Hero Headline"}
              </h1>
              <p className="text-lg text-gold">
                {data.hero.subheadline || "Hero subtitle"}
              </p>
              <p className="mx-auto max-w-2xl text-sm text-white/80">
                {data.hero.description || "Hero description"}
              </p>
              <button className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-ink">
                {data.hero.ctaText || "Get Started"}
              </button>
            </div>
          </div>
        </div>

        {/* About 预览 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
            {lang === "en" ? "About Section (3 Cards)" : "关于区域（三张卡片）"}
          </h3>
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">{data.about.title || "About"}</h2>
              <p className="mt-2 text-sm text-white/70">{data.about.lead || "Description"}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {(data.about.pillars || []).map((pillar, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink to-white/5 p-4"
                >
                  {pillar.imageUrl && (
                    <div className="absolute inset-0 opacity-30">
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${pillar.imageUrl})` }}
                      />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="mb-2 text-xl">{pillar.icon || "💡"}</div>
                    <h3 className="mb-1 text-sm font-semibold text-white">{pillar.title || "Title"}</h3>
                    <p className="text-xs text-white/70">{pillar.description || "Description"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact 预览 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
            {lang === "en" ? "Contact Section" : "联系区域"}
          </h3>
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink to-gold/10 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">{data.contact.title || "Contact"}</h2>
            <p className="mt-3 text-sm text-white/70">{data.contact.description || "Get in touch"}</p>
            <div className="mt-4">
              <a href={`mailto:${data.contact.email || "contact@example.com"}`} className="text-sm text-gold hover:underline">
                {data.contact.email || "contact@example.com"}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === "brand") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-white/10 bg-ink p-4">
          <p className="mb-2 text-xs text-white/60">Header Preview</p>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h1 className="text-2xl font-bold text-gold">{data.name || "Brand Name"}</h1>
            <div className="flex gap-4 text-sm text-white/70">
              <span>About</span>
              <span>Programs</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-ink p-4">
          <p className="mb-2 text-xs text-white/60">Footer Preview</p>
          <div className="border-t border-white/10 pt-4 text-center">
            <p className="text-xs text-white/60">{data.tagline || "Tagline"}</p>
            <p className="mt-2 text-xs text-white/40">© {new Date().getFullYear()} {data.name || "Brand Name"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (section === "hero") {
    return (
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink via-ink/95 to-gold/10 p-12 text-center">
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-white">
            {data.headline || "Hero Headline"}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            {data.subheadline || "Hero subheadline description"}
          </p>
          <div className="flex justify-center gap-4">
            <button className="rounded-full bg-gold px-6 py-3 font-semibold text-ink">
              {data.ctaText || "Get Started"}
            </button>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.3),transparent_50%)]" />
        </div>
      </div>
    );
  }

  if (section === "about") {
    const pillars = data.pillars || [];
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">{data.title || "About Section"}</h2>
          <p className="mt-2 text-white/70">{data.lead || "Section description"}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink to-white/5 p-6"
            >
              {pillar.imageUrl && (
                <div className="absolute inset-0 opacity-30">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${pillar.imageUrl})` }}
                  />
                </div>
              )}
              <div className="relative z-10">
                <div className="mb-3 text-2xl">{pillar.icon || "💡"}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{pillar.title || "Title"}</h3>
                <p className="text-sm text-white/70">{pillar.description || "Description"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "contact") {
    return (
      <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink to-gold/10 p-8 text-center">
        <h2 className="text-3xl font-bold text-white">{data.title || "Contact"}</h2>
        <p className="mt-4 text-white/70">{data.description || "Get in touch"}</p>
        <div className="mt-6">
          <a href={`mailto:${data.email || "contact@example.com"}`} className="text-gold hover:underline">
            {data.email || "contact@example.com"}
          </a>
        </div>
      </div>
    );
  }

  if (section === "program") {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-ink">
        {data.imageUrl && (
          <div className="relative h-48 w-full">
            <Image src={data.imageUrl} alt={data.title || "Program"} fill className="object-cover" />
          </div>
        )}
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider text-gold">{data.type || "Program"}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{data.title || "Program Title"}</h3>
          <p className="mt-3 text-sm text-white/70">{data.description || "Program description"}</p>
          {data.date && (
            <p className="mt-4 text-xs text-white/50">📅 {data.date}</p>
          )}
        </div>
      </div>
    );
  }

  if (section === "insight") {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-ink">
        {data.imageUrl && (
          <div className="relative h-48 w-full">
            <Image src={data.imageUrl} alt={data.title || "Insight"} fill className="object-cover" />
          </div>
        )}
        <div className="p-6">
          <p className="text-xs uppercase tracking-wider text-gold">{data.category || "Insight"}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{data.title || "Insight Title"}</h3>
          <p className="mt-3 text-sm text-white/70">{data.excerpt || "Insight excerpt"}</p>
          {data.date && (
            <p className="mt-4 text-xs text-white/50">📅 {data.date}</p>
          )}
        </div>
      </div>
    );
  }

  if (section === "partner") {
    return (
      <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white p-8">
        {data.logoUrl ? (
          <div className="relative h-16 w-40">
            <Image src={data.logoUrl} alt={data.name || "Partner"} fill className="object-contain" />
          </div>
        ) : (
          <div className="text-lg font-semibold text-gray-800">{data.name || "Partner Logo"}</div>
        )}
      </div>
    );
  }

  // Programs 列表预览
  if (section === "programs" && Array.isArray(data)) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
          {lang === "en" ? "Programs & Events" : "项目与活动"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {data.slice(0, 4).map((program) => (
            <div key={program.id} className="overflow-hidden rounded-lg border border-white/10 bg-ink">
              {program.imageUrl && (
                <div className="relative h-32 w-full bg-white/5">
                  <div className="flex h-full items-center justify-center text-xs text-white/50">
                    [Image: {program.imageUrl.substring(0, 30)}...]
                  </div>
                </div>
              )}
              <div className="p-4">
                <p className="text-xs uppercase tracking-wider text-gold">{program.type || "Program"}</p>
                <h3 className="mt-1 text-sm font-semibold text-white">
                  {(lang === "en" ? program.titleEn : program.titleZh) || "Program Title"}
                </h3>
                <p className="mt-2 text-xs text-white/70">
                  {(lang === "en" ? program.descriptionEn : program.descriptionZh) || "Description"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Insights 列表预览
  if (section === "insights" && Array.isArray(data)) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
          {lang === "en" ? "Insights & Intelligence" : "洞察与情报"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {data.slice(0, 4).map((insight) => (
            <div key={insight.id} className="overflow-hidden rounded-lg border border-white/10 bg-ink">
              {insight.imageUrl && (
                <div className="relative h-32 w-full bg-white/5">
                  <div className="flex h-full items-center justify-center text-xs text-white/50">
                    [Image: {insight.imageUrl.substring(0, 30)}...]
                  </div>
                </div>
              )}
              <div className="p-4">
                <p className="text-xs uppercase tracking-wider text-gold">{insight.category || "Insight"}</p>
                <h3 className="mt-1 text-sm font-semibold text-white">
                  {(lang === "en" ? insight.titleEn : insight.titleZh) || "Insight Title"}
                </h3>
                <p className="mt-2 text-xs text-white/70">
                  {(lang === "en" ? insight.excerptEn : insight.excerptZh) || "Excerpt"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Partners Logo 墙预览
  if (section === "partners" && Array.isArray(data)) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
          {lang === "en" ? "Strategic Partners (Logo Wall)" : "战略合作伙伴（Logo墙）"}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {data.slice(0, 9).map((partner) => (
            <div key={partner.id} className="flex items-center justify-center rounded-lg border border-white/10 bg-white p-6">
              <div className="text-center text-sm font-semibold text-gray-800">
                {partner.name || "Partner"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-white/50">
      Preview will appear here
    </div>
  );
}
