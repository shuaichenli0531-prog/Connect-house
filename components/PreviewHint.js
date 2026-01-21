"use client";

export default function PreviewHint({ section, lang = "en" }) {
  const hints = {
    en: {
      brand: "📍 Displayed in: Header & Footer",
      hero: "📍 Displayed in: Homepage Hero Section (Top)",
      about: "📍 Displayed in: About Section (3 Cards)",
      contact: "📍 Displayed in: Contact Section (Bottom)",
      venue: "📍 Displayed in: Homepage Right Card",
    },
    zh: {
      brand: "📍 显示位置：页头和页脚",
      hero: "📍 显示位置：首页顶部主视觉区",
      about: "📍 显示位置：关于区域（三张卡片）",
      contact: "📍 显示位置：联系区域（底部）",
      venue: "📍 显示位置：首页右侧卡片",
    },
  };

  return (
    <div className="mb-3 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold">
      {hints[lang][section]}
    </div>
  );
}
