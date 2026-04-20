"use client";

import AdminSection from "./AdminSection";
import AdminInput from "./AdminInput";
import ImageUpload from "./ImageUpload";
import ModernAdminSection from "./ModernAdminSection";
import LanguageTabs from "./LanguageTabs";
import VisibilityToggle from "./admin/VisibilityToggle";
import MultiImageUpload from "./admin/MultiImageUpload";

import { useState } from "react";

export default function SiteEditor({ site, setSite, lang, onSave }) {
  const [saveStatus, setSaveStatus] = useState("");
  const [heroLang, setHeroLang] = useState("en"); // Hero 区域的语言
  const [venueLang, setVenueLang] = useState("en"); // Venue 区域的语言
  const [contactLang, setContactLang] = useState("en"); // Contact 区域的语言

  const updateSite = (key, value) => {
    setSite({ ...site, [key]: value });
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await onSave();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000); // 3秒后清除状态
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 5000);
    }
  };

  const handleVisibilityChange = async (key, value) => {
    const nextSite = { ...site, [key]: value };
    setSite(nextSite);

    setSaveStatus("saving");
    try {
      await onSave(nextSite);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 5000);
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. Header/Brand Section */}
      <ModernAdminSection
        icon="🏠"
        title={lang === "en" ? "Brand & Header" : "品牌与页头"}
        description={lang === "en" ? "Brand logo and name displayed in the header" : "页头显示的品牌 Logo 和名称"}
        accent="gold"
        languageTabs={<LanguageTabs active={heroLang} onChange={setHeroLang} />}
      >
        <ImageUpload
          label={lang === "en" ? "Brand Logo" : "品牌 Logo"}
          value={site.brandLogoUrl || ""}
          onChange={(v) => updateSite("brandLogoUrl", v)}
          placeholder="Upload your logo"
        />

        <AdminInput
          label={lang === "en" ? "Brand Name" : "品牌名称"}
          value={site.brandName || ""}
          onChange={(v) => updateSite("brandName", v)}
          placeholder="Connect house"
        />

        {heroLang === "en" ? (
          <AdminInput
            label={lang === "en" ? "Mission Statement" : "使命宣言"}
            value={site.missionEn || ""}
            onChange={(v) => updateSite("missionEn", v)}
            placeholder="AN ELITE VC + LABS + COMMUNITY HUB ACCELERATING CROSS-BORDER INNOVATION."
            type="textarea"
            rows={2}
          />
        ) : (
          <AdminInput
            label={lang === "en" ? "Mission Statement" : "使命宣言"}
            value={site.missionZh || ""}
            onChange={(v) => updateSite("missionZh", v)}
            placeholder="以 VC + LABS + COMMUNITY 为核心的精英创新枢纽，推动跨境创新。"
            type="textarea"
            rows={2}
          />
        )}
      </ModernAdminSection>

      {/* 2. Hero Section */}
      <ModernAdminSection
        icon="🎯"
        title={lang === "en" ? "Hero Section" : "首页主视觉"}
        description={lang === "en" ? "Main headline and description at the top of your homepage" : "首页顶部的主标题和描述"}
        accent="blue"
        languageTabs={<LanguageTabs active={heroLang} onChange={setHeroLang} />}
      >

        {heroLang === "en" ? (
          <div className="space-y-4">
            <AdminInput
              label={lang === "en" ? "Badge Text" : "徽章文字"}
              value={site.heroBadgeEn || ""}
              onChange={(v) => updateSite("heroBadgeEn", v)}
              placeholder="NOW OPEN"
            />
            <AdminInput
              label={lang === "en" ? "Main Title" : "主标题"}
              value={site.heroTitle || ""}
              onChange={(v) => updateSite("heroTitle", v)}
              placeholder="Connect House"
            />
            <AdminInput
              label={lang === "en" ? "Subtitle" : "副标题"}
              value={site.heroSubtitleEn || ""}
              onChange={(v) => updateSite("heroSubtitleEn", v)}
              placeholder="Connecting the Brightest Minds in the Valley"
            />
            <AdminInput
              label={lang === "en" ? "Description" : "描述"}
              value={site.heroDescEn || ""}
              onChange={(v) => updateSite("heroDescEn", v)}
              placeholder="A Silicon Valley residence bringing together capital, research, and visionary founders..."
              type="textarea"
              rows={3}
            />

            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-sm text-white/70 mb-3">
                {lang === "en" ? "Call-to-Action Button" : "行动号召按钮"}
              </p>
              <div className="rounded-lg border border-gold/20 bg-gold/5 p-4">
                <div className="space-y-3">
                  <AdminInput
                    label={lang === "en" ? "Button Text" : "按钮文字"}
                    value={site.heroPrimaryCtaEn || ""}
                    onChange={(v) => updateSite("heroPrimaryCtaEn", v)}
                    placeholder="JOIN US"
                  />
                  <AdminInput
                    label={lang === "en" ? "Button Link" : "按钮链接"}
                    value={site.heroPrimaryLinkEn || ""}
                    onChange={(v) => updateSite("heroPrimaryLinkEn", v)}
                    placeholder="https://example.com/apply"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AdminInput
              label={lang === "en" ? "Badge Text" : "徽章文字"}
              value={site.heroBadgeZh || ""}
              onChange={(v) => updateSite("heroBadgeZh", v)}
              placeholder="现已开放"
            />
            <AdminInput
              label={lang === "en" ? "Subtitle" : "副标题"}
              value={site.heroSubtitleZh || ""}
              onChange={(v) => updateSite("heroSubtitleZh", v)}
              placeholder="连接硅谷最聪明的人才"
            />
            <AdminInput
              label={lang === "en" ? "Description" : "描述"}
              value={site.heroDescZh || ""}
              onChange={(v) => updateSite("heroDescZh", v)}
              placeholder="汇聚资本、研究与远见创始人的硅谷住所..."
              type="textarea"
              rows={3}
            />

            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-sm text-white/70 mb-3">
                {lang === "en" ? "Call-to-Action Button" : "行动号召按钮"}
              </p>
              <div className="rounded-lg border border-gold/20 bg-gold/5 p-4">
                <div className="space-y-3">
                  <AdminInput
                    label={lang === "en" ? "Button Text" : "按钮文字"}
                    value={site.heroPrimaryCtaZh || ""}
                    onChange={(v) => updateSite("heroPrimaryCtaZh", v)}
                    placeholder="加入我们"
                  />
                  <AdminInput
                    label={lang === "en" ? "Button Link" : "按钮链接"}
                    value={site.heroPrimaryLinkZh || ""}
                    onChange={(v) => updateSite("heroPrimaryLinkZh", v)}
                    placeholder="https://example.com/apply"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </ModernAdminSection>

      {/* 3. Recent Event Card (Hero Right Side) */}
      <ModernAdminSection
        icon="📅"
        title={lang === "en" ? "Recent Event Card" : "最近活动卡片"}
        description={lang === "en" ? "Event card displayed on the hero section (right side)" : "主视觉区域显示的活动卡片（右侧）"}
        accent="purple"
        languageTabs={<LanguageTabs active={venueLang} onChange={setVenueLang} />}
      >
        <ImageUpload
          label={lang === "en" ? "Event Image" : "活动图片"}
          value={site.recentEventImageUrl || ""}
          onChange={(v) => updateSite("recentEventImageUrl", v)}
          placeholder="https://images.unsplash.com/..."
        />

        <AdminInput
          label={lang === "en" ? "Event Date" : "活动日期"}
          value={site.recentEventDate || ""}
          onChange={(v) => updateSite("recentEventDate", v)}
          placeholder="March 15, 2026"
        />

        {venueLang === "en" ? (
          <div className="space-y-4">
            <AdminInput
              label={lang === "en" ? "Event Title" : "活动标题"}
              value={site.recentEventTitleEn || ""}
              onChange={(v) => updateSite("recentEventTitleEn", v)}
              placeholder="AI Founder Summit 2026"
            />
            <AdminInput
              label={lang === "en" ? "Description" : "描述"}
              value={site.recentEventDescEn || ""}
              onChange={(v) => updateSite("recentEventDescEn", v)}
              placeholder="A curated gathering of 100+ founders, investors, and researchers..."
              type="textarea"
              rows={2}
            />
            <div className="space-y-3">
              <AdminInput
                label={lang === "en" ? "Button Text" : "按钮文字"}
                value={site.venueCtaEn || ""}
                onChange={(v) => updateSite("venueCtaEn", v)}
                placeholder="Join Us"
              />
              <AdminInput
                label={lang === "en" ? "Button Link" : "按钮链接"}
                value={site.venueCtaLinkEn || ""}
                onChange={(v) => updateSite("venueCtaLinkEn", v)}
                placeholder="https://example.com/event"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AdminInput
              label={lang === "en" ? "Event Title" : "活动标题"}
              value={site.recentEventTitleZh || ""}
              onChange={(v) => updateSite("recentEventTitleZh", v)}
              placeholder="AI 创始人峰会 2026"
            />
            <AdminInput
              label={lang === "en" ? "Description" : "描述"}
              value={site.recentEventDescZh || ""}
              onChange={(v) => updateSite("recentEventDescZh", v)}
              placeholder="精选的 100+ 创始人、投资者和研究人员的聚会..."
              type="textarea"
              rows={2}
            />
            <div className="space-y-3">
              <AdminInput
                label={lang === "en" ? "Button Text" : "按钮文字"}
                value={site.venueCtaZh || ""}
                onChange={(v) => updateSite("venueCtaZh", v)}
                placeholder="加入我们"
              />
              <AdminInput
                label={lang === "en" ? "Button Link" : "按钮链接"}
                value={site.venueCtaLinkZh || ""}
                onChange={(v) => updateSite("venueCtaLinkZh", v)}
                placeholder="https://example.com/event"
              />
            </div>
          </div>
        )}
      </ModernAdminSection>

      {/* 4. Contact Section */}
      <ModernAdminSection
        icon="📧"
        title={lang === "en" ? "Contact Section" : "联系区域"}
        description={lang === "en" ? "House information and contact details" : "房子信息和联系方式"}
        accent="green"
        languageTabs={<LanguageTabs active={contactLang} onChange={setContactLang} />}
      >
        <VisibilityToggle
          label={lang === "en" ? "Show this section on website" : "在网站上显示此区域"}
          checked={site.showContactSection !== false}
          onChange={(v) => handleVisibilityChange("showContactSection", v)}
        />

        {/* Section Title */}
        {contactLang === "en" ? (
          <div className="space-y-4">
            <AdminInput
              label={lang === "en" ? "Section Title" : "区域标题"}
              value={site.contactTitleEn || ""}
              onChange={(v) => updateSite("contactTitleEn", v)}
              placeholder="Contact Us"
            />
            <AdminInput
              label={lang === "en" ? "Subtitle" : "副标题"}
              value={site.contactSubtitleEn || ""}
              onChange={(v) => updateSite("contactSubtitleEn", v)}
              placeholder="Get in touch with us"
              type="textarea"
              rows={2}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <AdminInput
              label={lang === "en" ? "Section Title" : "区域标题"}
              value={site.contactTitleZh || ""}
              onChange={(v) => updateSite("contactTitleZh", v)}
              placeholder="联系我们"
            />
            <AdminInput
              label={lang === "en" ? "Subtitle" : "副标题"}
              value={site.contactSubtitleZh || ""}
              onChange={(v) => updateSite("contactSubtitleZh", v)}
              placeholder="与我们取得联系"
              type="textarea"
              rows={2}
            />
          </div>
        )}

        {/* House Information */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <h4 className="mb-4 text-sm font-medium text-white/80">
            {lang === "en" ? "🏠 House Information" : "🏠 房子信息"}
          </h4>

          <MultiImageUpload
            label={lang === "en" ? "House Images (Carousel)" : "房子图片（轮播）"}
            images={site.houseImages || "[]"}
            onChange={(v) => updateSite("houseImages", v)}
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <AdminInput
              label={lang === "en" ? "Land Area" : "占地面积"}
              value={site.landArea || ""}
              onChange={(v) => updateSite("landArea", v)}
              placeholder="approx. 10,126 sqm (2.5 acres)"
            />
            <AdminInput
              label={lang === "en" ? "Floor Area" : "建筑面积"}
              value={site.floorArea || ""}
              onChange={(v) => updateSite("floorArea", v)}
              placeholder="approx. 721 sqm (7,765 sq ft)"
            />
            <AdminInput
              label={lang === "en" ? "Layout" : "户型"}
              value={site.layout || ""}
              onChange={(v) => updateSite("layout", v)}
              placeholder="7b6b"
            />
            <AdminInput
              label={lang === "en" ? "Capacity" : "容纳人数"}
              value={site.capacity || ""}
              onChange={(v) => updateSite("capacity", v)}
              placeholder="200 guests"
            />
          </div>
        </div>

        {/* Contact Person */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <h4 className="mb-4 text-sm font-medium text-white/80">
            {lang === "en" ? "👤 Contact Person" : "👤 联系人"}
          </h4>

          <div className="space-y-4">
            <AdminInput
              label={lang === "en" ? "Name" : "姓名"}
              value={site.contactName || ""}
              onChange={(v) => updateSite("contactName", v)}
              placeholder="Cathy Chang"
            />
            <AdminInput
              label={lang === "en" ? "LinkedIn" : "领英"}
              value={site.contactLinkedin || ""}
              onChange={(v) => updateSite("contactLinkedin", v)}
              placeholder="https://www.linkedin.com/in/yxchang/"
              type="url"
            />
            <AdminInput
              label={lang === "en" ? "Twitter" : "推特"}
              value={site.contactTwitter || ""}
              onChange={(v) => updateSite("contactTwitter", v)}
              placeholder="https://x.com/Cathy_c8i"
              type="url"
            />
            <div className="grid grid-cols-2 gap-4">
              <AdminInput
                label={lang === "en" ? "Mobile" : "手机"}
                value={site.contactMobile || ""}
                onChange={(v) => updateSite("contactMobile", v)}
                placeholder="5108947404"
              />
              <AdminInput
                label={lang === "en" ? "WeChat" : "微信"}
                value={site.contactWechat || ""}
                onChange={(v) => updateSite("contactWechat", v)}
                placeholder="GNAHC0002"
              />
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <h4 className="mb-4 text-sm font-medium text-white/80">
            {lang === "en" ? "📱 Scan to Join QR Code" : "📱 扫码加入二维码"}
          </h4>

          <ImageUpload
            label={lang === "en" ? "QR Code Image" : "二维码图片"}
            value={site.qrCodeUrl || ""}
            onChange={(v) => updateSite("qrCodeUrl", v)}
            placeholder="Upload your QR code image"
          />
        </div>
      </ModernAdminSection>

      {/* Save Button */}
      <div className="sticky bottom-0 z-20 border-t border-white/10 bg-ink/95 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          {/* 状态提示 */}
          <div className="text-sm">
            {saveStatus === "saving" && (
              <div className="flex items-center gap-2 text-gold">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                <span>{lang === "en" ? "Saving..." : "保存中..."}</span>
              </div>
            )}
            {saveStatus === "success" && (
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-xl">✓</span>
                <span>{lang === "en" ? "Saved successfully!" : "保存成功！"}</span>
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center gap-2 text-red-400">
                <span className="text-xl">✗</span>
                <span>{lang === "en" ? "Save failed" : "保存失败"}</span>
              </div>
            )}
          </div>

          {/* 保存按钮 */}
          <button
            className={`rounded-full px-8 py-3 font-semibold shadow-lg transition-all ${
              saveStatus === "saving"
                ? "cursor-not-allowed bg-gold/50 text-ink/50"
                : "bg-gold text-ink hover:scale-105 hover:shadow-xl"
            }`}
            onClick={handleSave}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving"
              ? lang === "en"
                ? "Saving..."
                : "保存中..."
              : lang === "en"
              ? "💾 Save All Changes"
              : "💾 保存所有更改"}
          </button>
        </div>
      </div>
    </div>
  );
}
