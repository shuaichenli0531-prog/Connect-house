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
  const [lang, setLang] = useState("en");
  const [secret, setSecret] = useState("change-me"); // 默认使用环境变量中的密码
  const [active, setActive] = useState("site");
  const [site, setSite] = useState(emptySite);
  const [programs, setPrograms] = useState([]);
  const [activeProgramId, setActiveProgramId] = useState(null);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [partners, setPartners] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [activePastEventId, setActivePastEventId] = useState(null);
  const [status, setStatus] = useState("");
  const [previewSection, setPreviewSection] = useState("hero");
  const [previewData, setPreviewData] = useState({});
  const [previewReady, setPreviewReady] = useState(false);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    const loadedPrograms = await programsRes.json();
    const loadedPartners = await partnersRes.json();

    // Handle pastEvents - may not exist yet
    let loadedPastEvents = [];
    try {
      if (pastEventsRes.ok) {
        loadedPastEvents = await pastEventsRes.json();
      }
    } catch (error) {
      console.log("PastEvents not available yet");
    }

    setPrograms(loadedPrograms);
    setPartners(loadedPartners);
    setPastEvents(loadedPastEvents);

    // 设置默认选中第一个卡片
    if (loadedPrograms.length > 0) setActiveProgramId(loadedPrograms[0].id);
    if (loadedPartners.length > 0) setActivePartnerId(loadedPartners[0].id);
    if (loadedPastEvents.length > 0) setActivePastEventId(loadedPastEvents[0].id);

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

    console.log("💾 Saving site config...");
    console.log("Current site state:", site);
    console.log("recentEventImageUrl:", site.recentEventImageUrl);

    // 将 JSON 对象转为字符串以存储到 SQLite
    const siteToSave = {
      ...site,
      aboutPillars: typeof site.aboutPillars === 'object'
        ? JSON.stringify(site.aboutPillars)
        : site.aboutPillars,
    };

    console.log("Data to save:", siteToSave);

    const res = await fetch("/api/admin/site", {
      method: "PUT",
      headers,
      body: JSON.stringify(siteToSave),
    });

    if (!res.ok) {
      console.error("❌ Save failed:", await res.text());
      setStatus("Save failed.");
      return;
    }

    const savedData = await res.json();
    console.log("✅ Saved successfully:", savedData);
    console.log("Saved recentEventImageUrl:", savedData.recentEventImageUrl);

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

    // 自动切换到新创建的卡片
    if (path === "programs") setActiveProgramId(created.id);
    if (path === "partners") setActivePartnerId(created.id);
    if (path === "pastevents") setActivePastEventId(created.id);

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
      partners: "合作伙伴",
      save: "保存",
      delete: "删除",
      add: "添加",
      published: "已发布",
    },
  };

  return (
    <div className="flex h-screen flex-col bg-ink text-white">
      {/* 顶部导航栏 */}
      <header className="shrink-0 border-b border-white/10 bg-gradient-to-r from-ink via-ink to-ink/95">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold/20 to-gold/10 text-xl">
                ⚙️
              </div>
              <div>
                <h1 className="text-base font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-white/50">
                  {lang === "en" ? "Content Management System" : "内容管理系统"}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="ml-8 flex gap-1">
              {[
                { id: "site", icon: "🏠", label: lang === "en" ? "Site" : "站点" },
                { id: "programs", icon: "📅", label: lang === "en" ? "Programs" : "项目" },
                { id: "partners", icon: "🤝", label: lang === "en" ? "Partners" : "伙伴" },
                { id: "past-events", icon: "📸", label: lang === "en" ? "Past Events" : "历史活动" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    active === item.id
                      ? "bg-gradient-to-r from-gold/20 to-gold/10 text-gold shadow-lg ring-1 ring-gold/30"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <LanguageToggle lang={lang} onChange={setLang} />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 中间内容区 */}
        <div className={`flex flex-col overflow-y-auto transition-all duration-300 ${previewCollapsed ? 'flex-1' : 'w-1/2'}`}>
          <div className="p-6 space-y-6">
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
            <div className="max-w-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {lang === "en" ? "Programs & Events" : "项目与活动"}
                </h2>
                <button
                  type="button"
                  className="shrink-0 rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 px-5 py-2 text-sm font-semibold text-gold shadow-lg ring-1 ring-gold/30 transition-all hover:shadow-xl"
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
              <p className="mt-1 text-sm text-white/60">
                {lang === "en"
                  ? "Manage programs displayed on the homepage"
                  : "管理首页显示的项目活动"}
              </p>
            </div>

            {/* Tab 切换卡片 */}
            {programs.length > 0 && programs.map((program) =>
              activeProgramId === program.id ? (
                <ProgramEditor
                  key={program.id}
                  program={program}
                  lang={lang}
                  onChange={(field, value) => updateList(setPrograms, program.id, field, value)}
                  onSave={() => updateItem("programs", program.id, program, setPrograms)}
                  onDelete={() => deleteItem("programs", program.id, setPrograms)}
                  cardTabs={
                    <div className="flex gap-1">
                      {programs.map((p, index) => (
                        <button
                          key={p.id}
                          onClick={() => setActiveProgramId(p.id)}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            activeProgramId === p.id
                              ? "bg-gold text-ink shadow-lg"
                              : "text-white/60 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {lang === "en" ? `Card ${index + 1}` : `卡片 ${index + 1}`}
                        </button>
                      ))}
                    </div>
                  }
                />
              ) : null
            )}

            {programs.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/20 p-12 text-center">
                <p className="text-white/50">
                  {lang === "en" ? "No programs yet. Click '+ Add Program' to create one." : "还没有项目。点击 '+ 添加项目' 来创建。"}
                </p>
              </div>
            )}
          </section>
        )}

        {active === "partners" && (
          <section className="space-y-6">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {lang === "en" ? "Strategic Partners" : "战略合作伙伴"}
                </h2>
                <button
                  type="button"
                  className="shrink-0 rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 px-5 py-2 text-sm font-semibold text-gold shadow-lg ring-1 ring-gold/30 transition-all hover:shadow-xl"
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
              <p className="mt-1 text-sm text-white/60">
                {lang === "en"
                  ? "Manage partners displayed in the logo wall"
                  : "管理Logo墙中显示的合作伙伴"}
              </p>
            </div>

            {/* Tab 切换卡片 */}
            {partners.length > 0 && partners.map((partner) =>
              activePartnerId === partner.id ? (
                <PartnerEditor
                  key={partner.id}
                  partner={partner}
                  lang={lang}
                  onChange={(field, value) => updateList(setPartners, partner.id, field, value)}
                  onSave={() => updateItem("partners", partner.id, partner, setPartners)}
                  onDelete={() => deleteItem("partners", partner.id, setPartners)}
                  cardTabs={
                    <div className="flex gap-1">
                      {partners.map((p, index) => (
                        <button
                          key={p.id}
                          onClick={() => setActivePartnerId(p.id)}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            activePartnerId === p.id
                              ? "bg-gold text-ink shadow-lg"
                              : "text-white/60 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {lang === "en" ? `Card ${index + 1}` : `卡片 ${index + 1}`}
                        </button>
                      ))}
                    </div>
                  }
                />
              ) : null
            )}

            {partners.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/20 p-12 text-center">
                <p className="text-white/50">
                  {lang === "en" ? "No partners yet. Click '+ Add Partner' to create one." : "还没有合作伙伴。点击 '+ 添加合作伙伴' 来创建。"}
                </p>
              </div>
            )}
          </section>
        )}

        {active === "past-events" && (
          <section className="space-y-6">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {lang === "en" ? "Past Events Gallery" : "历史活动展示"}
                </h2>
                <button
                  type="button"
                  className="shrink-0 rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 px-5 py-2 text-sm font-semibold text-gold shadow-lg ring-1 ring-gold/30 transition-all hover:shadow-xl"
                  onClick={() => createItem("pastevents", {
                    titleEn: "",
                    titleZh: "",
                    descEn: "",
                    descZh: "",
                    imageUrl: "",
                    date: "",
                    sortOrder: pastEvents.length + 1,
                    published: true,
                  }, setPastEvents)}
                >
                  {lang === "en" ? "+ Add Event" : "+ 添加活动"}
                </button>
              </div>
              <p className="mt-1 text-sm text-white/60">
                {lang === "en"
                  ? "Manage historical events displayed in the carousel"
                  : "管理轮播墙中显示的历史活动"}
              </p>
            </div>

            {/* Tab 切换卡片 */}
            {pastEvents.length > 0 && pastEvents.map((event) =>
              activePastEventId === event.id ? (
                <PastEventEditor
                  key={event.id}
                  event={event}
                  lang={lang}
                  onChange={(field, value) => updateList(setPastEvents, event.id, field, value)}
                  onSave={() => updateItem("pastevents", event.id, event, setPastEvents)}
                  onDelete={() => deleteItem("pastevents", event.id, setPastEvents)}
                  cardTabs={
                    <div className="flex gap-1">
                      {pastEvents.map((e, index) => (
                        <button
                          key={e.id}
                          onClick={() => setActivePastEventId(e.id)}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            activePastEventId === e.id
                              ? "bg-gold text-ink shadow-lg"
                              : "text-white/60 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {lang === "en" ? `Card ${index + 1}` : `卡片 ${index + 1}`}
                        </button>
                      ))}
                    </div>
                  }
                />
              ) : null
            )}

            {pastEvents.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/20 p-12 text-center">
                <p className="text-white/50">
                  {lang === "en" ? "No events yet. Click '+ Add Event' to create one." : "还没有活动。点击 '+ 添加活动' 来创建。"}
                </p>
              </div>
            )}
          </section>
        )}
          </div>
        </div>

        {/* 右侧预览区 */}
        <div className={`flex flex-col overflow-hidden bg-[#0a0a0a] transition-all duration-300 ${previewCollapsed ? 'w-0' : 'w-1/2'}`}>
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
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  <span>{lang === "en" ? "Hide" : "隐藏"}</span>
                  <span>✕</span>
                </button>
              </div>
            </div>
            <div className="preview-container flex-1 overflow-hidden bg-[#0a0a0a] p-2">
              <iframe
                id="preview-iframe"
                src="/preview"
                className="h-full w-full rounded-lg border border-white/5 bg-white shadow-2xl"
                title="Live Preview"
              />
            </div>
          </>
        )}
        </div>
      </div>

      {/* 预览控制按钮 - 右侧边缘中间位置 */}
      {previewCollapsed && (
        <button
          onClick={() => setPreviewCollapsed(false)}
          className="group fixed right-0 top-1/2 z-50 flex -translate-y-1/2 items-center gap-2 rounded-l-xl bg-gradient-to-l from-gold to-yellow-500 py-4 pl-4 pr-2 text-ink shadow-2xl transition-all hover:pl-6"
        >
          <span className="max-w-0 overflow-hidden text-sm font-semibold transition-all duration-300 group-hover:max-w-xs">
            {lang === "en" ? "Preview" : "预览"}
          </span>
          <span className="text-lg">👁️</span>
        </button>
      )}
    </div>
  );
}
