"use client";

import { useEffect, useState } from "react";
import LanguageToggle from "../components/LanguageToggle";
import ProgramCard from "../components/ProgramCard";
import SectionHeading from "../components/SectionHeading";

import ApplicationForm from "../components/ApplicationForm";
import ScrollReveal from "../components/ScrollReveal";
import LogoWall from "../components/LogoWall";
import PastEventsCarousel from "../components/PastEventsCarousel";

const fallbackContent = {
  brand: {
    name: "The House",
    tagline: {
      en: "The confluence of capital, research, and visionary founders.",
      zh: "资本、研究与远见创始人的交汇点。",
    },
    mission: {
      en: "An elite VC + Labs + Community hub accelerating cross-border innovation.",
      zh: "以 VC + Labs + Community 为核心的精英创新枢纽，推动跨境创新。",
    },
  },
  nav: {
    en: [
      { label: "Home", href: "#home" },
      { label: "Contact", href: "#contact" },
    ],
    zh: [
      { label: "首页", href: "#home" },
      { label: "联系", href: "#contact" },
    ],
  },
};

function buildContent(site, programs, insights, partners, pastEvents) {
  // aboutPillars 可能是字符串（从数据库）或对象（从预览）
  let aboutPillars = [];
  if (site?.aboutPillars) {
    if (typeof site.aboutPillars === 'string') {
      try {
        aboutPillars = JSON.parse(site.aboutPillars);
      } catch (e) {
        console.error("Failed to parse aboutPillars:", e);
      }
    } else {
      aboutPillars = site.aboutPillars;
    }
  }
  return {
    site,
    partnersData: (partners || []).filter(p => p.published !== false),
    brand: {
      name: site?.brandName || fallbackContent.brand.name,
      logoUrl: site?.brandLogoUrl || "",
      tagline: {
        en: site?.taglineEn || fallbackContent.brand.tagline.en,
        zh: site?.taglineZh || fallbackContent.brand.tagline.zh,
      },
      mission: {
        en: site?.missionEn || fallbackContent.brand.mission.en,
        zh: site?.missionZh || fallbackContent.brand.mission.zh,
      },
    },
    hero: {
      en: {
        badge: site?.heroBadgeEn,
        title: site?.heroTitle,
        subtitle: site?.heroSubtitleEn,
        description: site?.heroDescEn,
        primaryCta: site?.heroPrimaryCtaEn,
        primaryLink: site?.heroPrimaryLinkEn || "#programs",
        secondaryCta: site?.heroSecondaryCtaEn,
        secondaryLink: site?.heroSecondaryLinkEn || "#programs",
      },
      zh: {
        badge: site?.heroBadgeZh,
        title: site?.heroTitle,
        subtitle: site?.heroSubtitleZh,
        description: site?.heroDescZh,
        primaryCta: site?.heroPrimaryCtaZh,
        primaryLink: site?.heroPrimaryLinkZh || "#programs",
        secondaryCta: site?.heroSecondaryCtaZh,
        secondaryLink: site?.heroSecondaryLinkZh || "#programs",
      },
    },
    about: {
      en: {
        title: site?.aboutTitleEn,
        lead: site?.aboutLeadEn,
        pillars: aboutPillars.map((pillar) => ({
          title: pillar.titleEn,
          description: pillar.descriptionEn,
          icon: pillar.icon,
          imageUrl: pillar.imageUrl,
        })),
      },
      zh: {
        title: site?.aboutTitleZh,
        lead: site?.aboutLeadZh,
        pillars: aboutPillars.map((pillar) => ({
          title: pillar.titleZh,
          description: pillar.descriptionZh,
          icon: pillar.icon,
          imageUrl: pillar.imageUrl,
        })),
      },
    },
    programs: {
      en: {
        title: "Programs & Events",
        subtitle: "Apply to private salons, cross-border accelerators, and fellowship cohorts.",
        cta: "View all programs",
      },
      zh: {
        title: "项目与活动",
        subtitle: "申请私享沙龙、跨境加速器与 Fellowship 项目。",
        cta: "查看全部项目",
      },
      items: (programs || []).filter(p => p.published !== false),
    },
    partners: {
      en: {
        title: "Strategic Partners",
        subtitle: "Capital, academia, and operator networks powering the House.",
        logos: partners?.map((partner) => partner.name) || [],
      },
      zh: {
        title: "战略合作伙伴",
        subtitle: "资本、学术与运营网络共同赋能。",
        logos: partners?.map((partner) => partner.name) || [],
      },
    },
    insights: {
      en: {
        title: "Insights & Intelligence",
        subtitle: "Curated reports, founder briefs, and frontier research digests.",
        items: (insights || []).filter(i => i.published !== false).map((item) => ({
          title: item.titleEn,
          description: item.descriptionEn,
          link: item.link,
          imageUrl: item.imageUrl,
        })),
      },
      zh: {
        title: "洞察与情报",
        subtitle: "精选报告、创始人简报与前沿研究摘要。",
        items: (insights || []).filter(i => i.published !== false).map((item) => ({
          title: item.titleZh,
          description: item.descriptionZh,
          link: item.link,
          imageUrl: item.imageUrl,
        })),
      },
    },
    contact: {
      en: {
        title: site?.contactTitleEn,
        subtitle: site?.contactSubtitleEn,
        email: site?.contactEmail,
        address: site?.contactAddressEn,
        cta: site?.contactCtaEn,
      },
      zh: {
        title: site?.contactTitleZh,
        subtitle: site?.contactSubtitleZh,
        email: site?.contactEmail,
        address: site?.contactAddressZh,
        cta: site?.contactCtaZh,
      },
    },
    pastEvents: (pastEvents || []).filter(e => e.published !== false),
  };
}

export default function HomePage({ previewData = null }) {
  const [lang, setLang] = useState("en");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 监听来自后台的预览消息
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "PREVIEW_UPDATE") {
        console.log("📺 Preview received message:", event.data);
        const { data } = event.data;
        console.log("📺 Updating preview with:", data);

        setIsPreviewMode(true);
        setLang(data.lang || "en");
        setContent(buildContent(
          data.site,
          data.programs || [],
          data.insights || [],
          data.partners || [],
          data.pastEvents || []
        ));
        setLoading(false);

        console.log("📺 Current preview data:", { site: data.site, lang: data.lang });
      }
    };

    window.addEventListener("message", handleMessage);
    console.log("📺 Preview page ready");

    // 通知父窗口预览页面已准备好
    if (window.parent !== window) {
      window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // 如果有预览数据，使用预览数据
    if (previewData) {
      setLang(previewData.lang || "en");
      setContent(buildContent(previewData.site, previewData.programs, previewData.insights, previewData.partners, previewData.pastEvents || []));
      setLoading(false);
      return;
    }

    // 如果在预览模式中，不要从 API 加载数据
    if (isPreviewMode) {
      return;
    }

    // 否则从 API 获取真实数据
    async function fetchContent() {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setContent(buildContent(data.site, data.programs, data.insights, data.partners, data.pastEvents || []));
      } catch (error) {
        console.error("Failed to load content:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [previewData, isPreviewMode]);

  // Show loading screen while fetching data
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 animate-ping rounded-full bg-gold/20"></div>
              <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                <span className="text-3xl">🏠</span>
              </div>
            </div>
          </div>

          {/* Loading text */}
          <h2 className="mb-4 text-2xl font-bold text-white">The House</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gold"></div>
          </div>
          <p className="mt-4 text-sm text-white/50">Loading content...</p>
        </div>
      </div>
    );
  }

  const siteContent = content || buildContent(null, [], [], [], []);
  const navItems = fallbackContent.nav[lang];
  const hero = siteContent.hero[lang];
  const about = siteContent.about[lang];
  const programs = siteContent.programs[lang];
  const partners = siteContent.partners[lang];
  const insights = siteContent.insights[lang];
  const contact = siteContent.contact[lang];

  return (
    <div className="min-h-screen animate-fadeIn">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur transition-all">
        <div className="container-wide flex items-center justify-between py-4">
          <a href="#home" className="flex items-center gap-3 text-lg font-semibold text-white transition-all hover:text-gold">
            {siteContent.brand.logoUrl && (
              <div className="flex h-10 w-20 items-center justify-center md:h-12 md:w-28">
                <img
                  src={siteContent.brand.logoUrl}
                  alt={siteContent.brand.name}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <span className="leading-none">{siteContent.brand.name}</span>
          </a>
          <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.3em] text-white/70 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative transition-colors hover:text-gold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>
      </header>

      <main>
        <section id="home" className="section-padding">
          <div className="container-wide grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <span className="badge animate-fade-in">{hero.badge}</span>
              <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <h1 className="text-5xl font-semibold text-white md:text-6xl">{hero.title}</h1>
                <p className="mt-3 text-lg text-gold">{hero.subtitle}</p>
              </div>
              <p className="max-w-xl text-base text-white/70 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                {hero.description}
              </p>
              <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <a
                  href={hero.primaryLink}
                  target={hero.primaryLink.startsWith('http') ? '_blank' : undefined}
                  rel={hero.primaryLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="btn-primary transition-all hover:scale-105 hover:shadow-xl"
                >
                  {hero.primaryCta}
                </a>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                {siteContent.brand.mission[lang]}
              </p>
            </div>
            <div className="card group overflow-hidden animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {siteContent.site?.recentEventImageUrl && (
                <div className="relative h-48 w-full overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${siteContent.site?.recentEventImageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                </div>
              )}
              <div className="p-8">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  {lang === "en" ? "RECENT EVENT" : "最近活动"}
                </p>
                {siteContent.site?.recentEventDate && (
                  <p className="mt-2 text-xs text-gold">
                    {siteContent.site.recentEventDate}
                  </p>
                )}
                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {lang === "en"
                    ? (siteContent.site?.recentEventTitleEn || "Upcoming Event")
                    : (siteContent.site?.recentEventTitleZh || "即将举办")}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {lang === "en"
                    ? (siteContent.site?.recentEventDescEn || "Join us for our latest community gathering.")
                    : (siteContent.site?.recentEventDescZh || "加入我们最新的社区聚会。")}
                </p>
                <div className="mt-8">
                  <a
                    href={lang === "en"
                      ? (siteContent.site?.venueCtaLinkEn || "#programs")
                      : (siteContent.site?.venueCtaLinkZh || "#programs")}
                    target={(lang === "en" ? siteContent.site?.venueCtaLinkEn : siteContent.site?.venueCtaLinkZh)?.startsWith('http') ? '_blank' : undefined}
                    rel={(lang === "en" ? siteContent.site?.venueCtaLinkEn : siteContent.site?.venueCtaLinkZh)?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-block rounded-lg border-2 border-gold/30 px-6 py-2.5 text-sm font-semibold text-gold transition-all hover:border-gold hover:bg-gold/10"
                  >
                    {lang === "en"
                      ? (siteContent.site?.venueCtaEn || "Learn More")
                      : (siteContent.site?.venueCtaZh || "了解更多")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="programs" className="section-padding">
          <div className="container-wide space-y-10">
            <ScrollReveal>
              <SectionHeading title={programs.title} subtitle={programs.subtitle} />
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-3">
              {siteContent.programs.items.map((item, index) => (
                <ScrollReveal key={item.id || item.titleEn} delay={index * 150}>
                  <ProgramCard
                    lang={lang}
                    applyLabel={lang === "en" ? "Apply" : "申请"}
                    item={{
                      type: item.type,
                      title: lang === "en" ? item.titleEn : item.titleZh,
                      date: item.date,
                      location: item.location,
                      description: lang === "en" ? item.descriptionEn : item.descriptionZh,
                      link: item.link,
                      imageUrl: item.imageUrl,
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Past Events Gallery */}
        {siteContent.pastEvents && siteContent.pastEvents.length > 0 && (
          <section className="section-padding">
            <div className="container-wide space-y-10">
              <ScrollReveal>
                <SectionHeading
                  title={lang === "en" ? "Past Events" : "历史活动"}
                  subtitle={lang === "en" ? "Highlights from our community gatherings" : "社区活动精彩回顾"}
                />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <PastEventsCarousel events={siteContent.pastEvents} lang={lang} />
              </ScrollReveal>
            </div>
          </section>
        )}

        <section id="partners" className="section-padding bg-white/5">
          <div className="container-wide space-y-10">
            <ScrollReveal>
              <SectionHeading title={partners.title} subtitle={partners.subtitle} />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <LogoWall partners={siteContent.partnersData || []} />
            </ScrollReveal>
          </div>
        </section>

        <section id="contact" className="section-padding bg-white/5">
          <div className="container-wide grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <ScrollReveal>
              <div className="space-y-6">
                <SectionHeading title={contact.title} subtitle={contact.subtitle} />
                <div className="space-y-3 text-sm text-white/70">
                  <p>{contact.address}</p>
                  <p>{contact.email}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* 二维码区域 */}
            <ScrollReveal delay={200}>
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {lang === "en"
                    ? (siteContent.site?.qrCodeLabelEn || "Join Our Community")
                    : (siteContent.site?.qrCodeLabelZh || "加入我们")}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {lang === "en"
                    ? (siteContent.site?.qrCodeTitleEn || "Scan to Apply")
                    : (siteContent.site?.qrCodeTitleZh || "扫码申请")}
                </h3>
                <p className="mt-3 text-sm text-white/70 max-w-xs">
                  {lang === "en"
                    ? (siteContent.site?.qrCodeDescEn || "Scan the QR code to access our membership application")
                    : (siteContent.site?.qrCodeDescZh || "扫描二维码申请会员资格")}
                </p>

                {/* 二维码容器 */}
                <div className="mt-6 rounded-xl bg-white p-4">
                  {siteContent.site?.qrCodeUrl ? (
                    <img
                      src={siteContent.site.qrCodeUrl}
                      alt="QR Code"
                      className="h-48 w-48 object-contain"
                    />
                  ) : (
                    <div className="h-48 w-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-xs text-gray-400 text-center px-4">
                        {lang === "en" ? "QR Code\nConfigure in admin" : "二维码\n后台配置"}
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-xs text-white/50">
                  {lang === "en"
                    ? (siteContent.site?.qrCodeFooterEn || "Private salons · Fellowships · Summits")
                    : (siteContent.site?.qrCodeFooterZh || "私享沙龙 · 会员项目 · 峰会活动")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="container-wide flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-white/40">
          <span>{siteContent.brand.name} © 2026</span>
          <span>{siteContent.brand.tagline[lang]}</span>
        </div>
      </footer>
    </div>
  );
}
