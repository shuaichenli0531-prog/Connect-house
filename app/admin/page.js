"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../../components/AdminNav";
import LanguageToggle from "../../components/LanguageToggle";
import PreviewHint from "../../components/PreviewHint";
import LivePreview from "../../components/LivePreview";
import SiteEditor from "../../components/SiteEditor";
import ImageUpload from "../../components/ImageUpload";
import ProgramEditor from "../../components/ProgramEditor";
import PartnerEditor from "../../components/PartnerEditor";
import PastEventEditor from "../../components/PastEventEditor";
import VisibilityToggle from "../../components/admin/VisibilityToggle";

const emptySite = {
  brandName: "",
  taglineEn: "",
  taglineZh: "",
  missionEn: "",
  missionZh: "",
  heroBadgeEn: "",
  heroBadgeZh: "",
  heroTitle: "",
  heroSubtitleEn: "",
  heroSubtitleZh: "",
  heroDescEn: "",
  heroDescZh: "",
  heroPrimaryCtaEn: "",
  heroPrimaryCtaZh: "",
  heroSecondaryCtaEn: "",
  heroSecondaryCtaZh: "",
  heroImageUrl: "",
  venueImageUrl: "",
  aboutTitleEn: "",
  aboutTitleZh: "",
  aboutLeadEn: "",
  aboutLeadZh: "",
  aboutPillars: [],
  contactTitleEn: "",
  contactTitleZh: "",
  contactSubtitleEn: "",
  contactSubtitleZh: "",
  contactEmail: "",
  contactAddressEn: "",
  contactAddressZh: "",
  contactCtaEn: "",
  contactCtaZh: "",
};

export default function AdminPage() {
  const [lang, setLang] = useState("zh");
  const [secret, setSecret] = useState(() => {
    // 从 localStorage 读取密码，如果没有则使用默认值
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminSecret') || "454536174";
    }
    return "454536174";
  });
  const [active, setActive] = useState("site");
  const [site, setSite] = useState(emptySite);
  const [programs, setPrograms] = useState([]);
  const [partners, setPartners] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [status, setStatus] = useState("");
  const [previewSection, setPreviewSection] = useState("hero");
  const [previewData, setPreviewData] = useState({});
  const [previewReady, setPreviewReady] = useState(false);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  // 保存密码到 localStorage
  useEffect(() => {
    if (secret && typeof window !== 'undefined') {
      localStorage.setItem('adminSecret', secret);
      console.log('🔑 Admin secret saved to localStorage');
    }
  }, [secret]);

  // 实时发送预览数据到 iframe
  useEffect(() => {
    const iframe = document.getElementById("preview-iframe");
    if (!iframe || !iframe.contentWindow) {
      console.log("Iframe not ready");
      return;
    }

    console.log("Sending preview data:", { site, programs, partners, pastEvents, lang });

    // 发送完整的预览数据到 iframe
    iframe.contentWindow.postMessage(
      {
        type: "PREVIEW_UPDATE",
        data: {
          site,
          programs,
          partners,
          pastEvents,
          lang,
        },
      },
      "*"
    );
  }, [site, programs, partners, pastEvents, lang]);

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    "x-admin-secret": secret,
  }), [secret]);

  async function loadAll() {
    if (!secret) return;
    const [siteRes, programsRes, partnersRes, pastEventsRes] = await Promise.all([
      fetch("/api/admin/site", { headers }),
      fetch("/api/admin/programs", { headers }),
      fetch("/api/admin/partners", { headers }),
      fetch("/api/admin/pastevents", { headers }),
    ]);

    if (siteRes.status === 401) {
      setStatus("Unauthorized. Check your admin secret.");
      return;
    }

    const rawSite = await siteRes.json();

    // 解析 JSON 字符串字段
    const parsedSite = {
      ...rawSite,
      aboutPillars: typeof rawSite.aboutPillars === 'string'
        ? JSON.parse(rawSite.aboutPillars)
        : rawSite.aboutPillars,
    };

    setSite(parsedSite);
    setPrograms(await programsRes.json());
    setPartners(await partnersRes.json());
    setPastEvents(await pastEventsRes.json());
    setStatus("Loaded.");
  }

  useEffect(() => {
    loadAll();

    // 监听来自预览 iframe 的消息
    function handleMessage(event) {
      if (event.data.type === "PREVIEW_READY") {
        setPreviewReady(true);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []); // 只在页面加载时执行一次

  // 将 saveSite 暴露给子组件
  if (typeof window !== 'undefined') {
    window.saveSite = saveSite;
  }

  async function saveSite() {
    setStatus("Saving...");

    // 将 JSON 对象转为字符串以存储到 SQLite
    const siteToSave = {
      ...site,
      aboutPillars: typeof site.aboutPillars === 'object'
        ? JSON.stringify(site.aboutPillars)
        : site.aboutPillars,
    };

    const res = await fetch("/api/admin/site", {
      method: "PUT",
      headers,
      body: JSON.stringify(siteToSave),
    });
    if (!res.ok) {
      setStatus("Save failed.");
      return;
    }
    setStatus("Saved.");
  }

  async function createItem(path, item, setList) {
    const res = await fetch(`/api/admin/${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      setStatus("Create failed.");
      return;
    }
    const created = await res.json();
    setList((prev) => [...prev, created]);
    setStatus("Created.");
  }

  async function updateItem(path, id, item, setList) {
    const res = await fetch(`/api/admin/${path}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      setStatus("Update failed.");
      return;
    }
    const updated = await res.json();
    setList((prev) => prev.map((row) => (row.id === id ? updated : row)));
    setStatus("Updated.");
  }

  async function deleteItem(path, id, setList) {
    const res = await fetch(`/api/admin/${path}/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      setStatus("Delete failed.");
      return;
    }
    setList((prev) => prev.filter((row) => row.id !== id));
    setStatus("Deleted.");
  }

  function updateList(setList, id, key, value) {
    setList((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  const t = {
    en: {
      title: "Admin",
      subtitle: "Local content management",
      secretPlaceholder: "Admin secret",
      site: "Site",
      programs: "Programs",
      insights: "Insights",
      partners: "Partners",
      save: "Save",
      delete: "Delete",
      add: "Add",
      published: "Published",
    },
    zh: {
      title: "管理后台",
      subtitle: "本地内容管理",
      secretPlaceholder: "管理员密码",
      site: "站点配置",
      programs: "项目活动",
      insights: "洞察文章",
      partners: "合作伙伴",
      save: "保存",
      delete: "删除",
      add: "添加",
      published: "已发布",
    },
  };

  return (
    <div className="flex h-screen bg-ink text-white">
      {/* 左侧编辑区 */}
      <div className={`flex flex-col overflow-y-auto border-r border-white/10 transition-all duration-300 ${previewCollapsed ? 'w-full' : 'w-1/2'}`}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{t[lang].title}</h1>
              <p className="text-xs text-white/60">{t[lang].subtitle}</p>
            </div>
            <LanguageToggle lang={lang} onChange={setLang} />
          </div>

          <AdminNav active={active} onSelect={setActive} lang={lang} />
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{status}</p>

          {active === "site" && (
            <section>
              <SiteEditor site={site} setSite={setSite} lang={lang} onSave={saveSite} />
            </section>
          )}

          {active === "site_old" && (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="card p-6 space-y-3">
                  <h2 className="text-lg font-semibold">{lang === "en" ? "Brand" : "品牌信息"}</h2>
                  <PreviewHint section="brand" lang={lang} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Brand name" value={site.brandName || ""} onChange={(e) => setSite({ ...site, brandName: e.target.value })} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Tagline EN" value={site.taglineEn || ""} onChange={(e) => setSite({ ...site, taglineEn: e.target.value })} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Tagline ZH" value={site.taglineZh || ""} onChange={(e) => setSite({ ...site, taglineZh: e.target.value })} />
                  <textarea className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Mission EN" value={site.missionEn || ""} onChange={(e) => setSite({ ...site, missionEn: e.target.value })} />
                  <textarea className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Mission ZH" value={site.missionZh || ""} onChange={(e) => setSite({ ...site, missionZh: e.target.value })} />
                </div>
                <div className="card p-6 space-y-3">
                  <h2 className="text-lg font-semibold">{lang === "en" ? "Hero Section" : "首页主视觉"}</h2>
                  <PreviewHint section="hero" lang={lang} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Hero badge EN" value={site.heroBadgeEn || ""} onChange={(e) => setSite({ ...site, heroBadgeEn: e.target.value })} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Hero badge ZH" value={site.heroBadgeZh || ""} onChange={(e) => setSite({ ...site, heroBadgeZh: e.target.value })} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Hero title" value={site.heroTitle || ""} onChange={(e) => setSite({ ...site, heroTitle: e.target.value })} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Hero subtitle EN" value={site.heroSubtitleEn || ""} onChange={(e) => setSite({ ...site, heroSubtitleEn: e.target.value })} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Hero subtitle ZH" value={site.heroSubtitleZh || ""} onChange={(e) => setSite({ ...site, heroSubtitleZh: e.target.value })} />
                  <textarea className="h-28 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Hero description EN" value={site.heroDescEn || ""} onChange={(e) => setSite({ ...site, heroDescEn: e.target.value })} />
                  <textarea className="h-28 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Hero description ZH" value={site.heroDescZh || ""} onChange={(e) => setSite({ ...site, heroDescZh: e.target.value })} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Primary CTA EN" value={site.heroPrimaryCtaEn || ""} onChange={(e) => setSite({ ...site, heroPrimaryCtaEn: e.target.value })} />
                    <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Primary CTA ZH" value={site.heroPrimaryCtaZh || ""} onChange={(e) => setSite({ ...site, heroPrimaryCtaZh: e.target.value })} />
                    <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Secondary CTA EN" value={site.heroSecondaryCtaEn || ""} onChange={(e) => setSite({ ...site, heroSecondaryCtaEn: e.target.value })} />
                    <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Secondary CTA ZH" value={site.heroSecondaryCtaZh || ""} onChange={(e) => setSite({ ...site, heroSecondaryCtaZh: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="card p-6 space-y-3">
                <h2 className="text-lg font-semibold">{lang === "en" ? "About Section" : "关于区域"}</h2>
                <PreviewHint section="about" lang={lang} />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="About title EN" value={site.aboutTitleEn || ""} onChange={(e) => setSite({ ...site, aboutTitleEn: e.target.value })} />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="About title ZH" value={site.aboutTitleZh || ""} onChange={(e) => setSite({ ...site, aboutTitleZh: e.target.value })} />
                <textarea className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="About lead EN" value={site.aboutLeadEn || ""} onChange={(e) => setSite({ ...site, aboutLeadEn: e.target.value })} />
                <textarea className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="About lead ZH" value={site.aboutLeadZh || ""} onChange={(e) => setSite({ ...site, aboutLeadZh: e.target.value })} />
                <textarea className="h-32 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="About pillars JSON" value={JSON.stringify(site.aboutPillars || [], null, 2)} onChange={(e) => {
                  try {
                    setSite({ ...site, aboutPillars: JSON.parse(e.target.value) });
                    setStatus("");
                  } catch {
                    setStatus("About pillars JSON invalid");
                  }
                }} />
              </div>

              <div className="card p-6 space-y-3">
                <h2 className="text-lg font-semibold">{lang === "en" ? "Contact Section" : "联系区域"}</h2>
                <PreviewHint section="contact" lang={lang} />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact title EN" value={site.contactTitleEn || ""} onChange={(e) => setSite({ ...site, contactTitleEn: e.target.value })} />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact title ZH" value={site.contactTitleZh || ""} onChange={(e) => setSite({ ...site, contactTitleZh: e.target.value })} />
                <textarea className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact subtitle EN" value={site.contactSubtitleEn || ""} onChange={(e) => setSite({ ...site, contactSubtitleEn: e.target.value })} />
                <textarea className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact subtitle ZH" value={site.contactSubtitleZh || ""} onChange={(e) => setSite({ ...site, contactSubtitleZh: e.target.value })} />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact email" value={site.contactEmail || ""} onChange={(e) => setSite({ ...site, contactEmail: e.target.value })} />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact address EN" value={site.contactAddressEn || ""} onChange={(e) => setSite({ ...site, contactAddressEn: e.target.value })} />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact address ZH" value={site.contactAddressZh || ""} onChange={(e) => setSite({ ...site, contactAddressZh: e.target.value })} />
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact CTA EN" value={site.contactCtaEn || ""} onChange={(e) => setSite({ ...site, contactCtaEn: e.target.value })} />
                  <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2" placeholder="Contact CTA ZH" value={site.contactCtaZh || ""} onChange={(e) => setSite({ ...site, contactCtaZh: e.target.value })} />
                </div>
              </div>

              <button type="button" className="btn-primary" onClick={saveSite}>
                {lang === "en" ? "Save site config" : "保存站点配置"}
              </button>
            </section>
          )}

          {active === "programs" && (
            <section className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {lang === "en" ? "Programs & Events" : "项目与活动"}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {lang === "en"
                        ? "Manage programs displayed on the homepage"
                        : "管理首页显示的项目活动"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 px-6 py-2.5 text-sm font-semibold text-gold shadow-lg ring-1 ring-gold/30 transition-all hover:shadow-xl"
                    onClick={() => createItem("programs", {
                      type: "FELLOWSHIP",
                      titleEn: "",
                      titleZh: "",
                      date: "",
                      location: "",
                      descriptionEn: "",
                      descriptionZh: "",
                      link: "",
                      imageUrl: "",
                      sortOrder: programs.length + 1,
                      published: true,
                    }, setPrograms)}
                  >
                    {lang === "en" ? "+ Add Program" : "+ 添加项目"}
                  </button>
                </div>

                <VisibilityToggle
                  label={lang === "en" ? "Show this section on website" : "在网站上显示此区域"}
                  checked={site.showProgramsSection !== false}
                  onChange={(v) => setSite({ ...site, showProgramsSection: v })}
                />
              </div>

              <div className="space-y-6">
                {programs.map((program) => (
                  <ProgramEditor
                    key={program.id}
                    program={program}
                    lang={lang}
                    onChange={(field, value) => updateList(setPrograms, program.id, field, value)}
                    onSave={() => updateItem("programs", program.id, program, setPrograms)}
                    onDelete={() => deleteItem("programs", program.id, setPrograms)}
                  />
                ))}
              </div>
            </section>
          )}

          {active === "partners" && (
            <section className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {lang === "en" ? "Strategic Partners" : "战略合作伙伴"}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {lang === "en"
                        ? "Manage partners displayed in the logo wall"
                        : "管理Logo墙中显示的合作伙伴"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 px-6 py-2.5 text-sm font-semibold text-gold shadow-lg ring-1 ring-gold/30 transition-all hover:shadow-xl"
                    onClick={() => createItem("partners", {
                      name: "",
                      logoUrl: "",
                      url: "",
                      sortOrder: partners.length + 1,
                      published: true,
                    }, setPartners)}
                  >
                    {lang === "en" ? "+ Add Partner" : "+ 添加合作伙伴"}
                  </button>
                </div>

                <VisibilityToggle
                  label={lang === "en" ? "Show this section on website" : "在网站上显示此区域"}
                  checked={site.showPartnersSection !== false}
                  onChange={(v) => setSite({ ...site, showPartnersSection: v })}
                />
              </div>

              <div className="space-y-6">
                {partners.map((partner) => (
                  <PartnerEditor
                    key={partner.id}
                    partner={partner}
                    lang={lang}
                    onChange={(field, value) => updateList(setPartners, partner.id, field, value)}
                    onSave={() => updateItem("partners", partner.id, partner, setPartners)}
                    onDelete={() => deleteItem("partners", partner.id, setPartners)}
                  />
                ))}
              </div>
            </section>
          )}

          {active === "pastEvents" && (
            <section className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {lang === "en" ? "Past Events" : "历史活动"}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {lang === "en"
                        ? "Manage past events displayed in the carousel"
                        : "管理展示在轮播图中的历史活动"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 px-6 py-2.5 text-sm font-semibold text-gold shadow-lg ring-1 ring-gold/30 transition-all hover:shadow-xl"
                    onClick={() => createItem("pastEvents", {
                      titleEn: "",
                      titleZh: "",
                      descriptionEn: "",
                      descriptionZh: "",
                      imageUrl: "",
                      date: "",
                      sortOrder: pastEvents.length + 1,
                      published: true,
                    }, setPastEvents)}
                  >
                    {lang === "en" ? "+ Add Past Event" : "+ 添加历史活动"}
                  </button>
                </div>

                <VisibilityToggle
                  label={lang === "en" ? "Show this section on website" : "在网站上显示此区域"}
                  checked={site.showPastEventsSection !== false}
                  onChange={(v) => setSite({ ...site, showPastEventsSection: v })}
                />
              </div>

              <div className="space-y-6">
                {pastEvents.map((event) => (
                  <PastEventEditor
                    key={event.id}
                    event={event}
                    lang={lang}
                    onChange={(field, value) => updateList(setPastEvents, event.id, field, value)}
                    onSave={() => updateItem("pastEvents", event.id, event, setPastEvents)}
                    onDelete={() => deleteItem("pastEvents", event.id, setPastEvents)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 右侧预览区 */}
      <div className={`flex flex-col overflow-hidden bg-white/5 transition-all duration-300 ${previewCollapsed ? 'w-0' : 'w-1/2'}`}>
        {!previewCollapsed && (
          <>
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-ink px-6">
              <div>
                <h3 className="text-sm font-semibold text-gold">
                  {lang === "en" ? "✨ Live Preview" : "✨ 实时预览"}
                </h3>
                <p className="text-xs text-white/50">
                  {lang === "en"
                    ? "Changes appear instantly • Save to publish"
                    : "实时显示修改 • 保存后发布"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!previewReady && (
                  <div className="text-xs text-white/40">Loading...</div>
                )}
                <button
                  onClick={() => setPreviewCollapsed(true)}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/20"
                  title={lang === "en" ? "Hide Preview" : "隐藏预览"}
                >
                  {lang === "en" ? "Hide" : "隐藏"} →
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                id="preview-iframe"
                src="/preview"
                className="h-full w-full border-0 bg-white"
                title="Live Preview"
              />
            </div>
          </>
        )}
      </div>

      {/* 展开预览按钮 */}
      {previewCollapsed && (
        <button
          onClick={() => setPreviewCollapsed(false)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <span>👁️</span>
          <span>{lang === "en" ? "Show Preview" : "显示预览"}</span>
        </button>
      )}
    </div>
  );
}
