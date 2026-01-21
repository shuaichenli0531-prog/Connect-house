"use client";

import { useState } from "react";
import ModernAdminSection from "./ModernAdminSection";
import AdminInput from "./AdminInput";
import ImageUpload from "./ImageUpload";

export default function PartnerEditor({ partner, onChange, onSave, onDelete, lang, cardTabs }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModernAdminSection
      icon="🤝"
      title={partner.name || `Partner #${partner.id}`}
      description={lang === "en" ? "Edit partner details" : "编辑合作伙伴详情"}
      accent="green"
      cardTabs={cardTabs}
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            label={lang === "en" ? "Partner Name" : "合作伙伴名称"}
            value={partner.name || ""}
            onChange={(v) => onChange("name", v)}
            placeholder="OpenAI"
          />
          <AdminInput
            label={lang === "en" ? "Sort Order" : "排序"}
            value={partner.sortOrder || 0}
            onChange={(v) => onChange("sortOrder", Number(v))}
            placeholder="1"
            type="number"
          />
        </div>

        <ImageUpload
          label={lang === "en" ? "Partner Logo" : "合作伙伴Logo"}
          value={partner.logoUrl || ""}
          onChange={(v) => onChange("logoUrl", v)}
          placeholder="https://..."
        />

        <AdminInput
          label={lang === "en" ? "Website URL" : "网站链接"}
          value={partner.url || ""}
          onChange={(v) => onChange("url", v)}
          placeholder="https://www.openai.com"
        />

        {/* 操作按钮 */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={partner.published ?? true}
              onChange={(e) => onChange("published", e.target.checked)}
              className="rounded"
            />
            {lang === "en" ? "Published" : "已发布"}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
            >
              {lang === "en" ? "Delete" : "删除"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`rounded-lg px-6 py-2 text-sm font-medium shadow-lg ring-1 transition-all ${
                saved
                  ? "bg-green-500/20 text-green-400 ring-green-500/30"
                  : saving
                  ? "bg-gold/10 text-gold/50 ring-gold/20"
                  : "bg-gradient-to-r from-gold/20 to-gold/10 text-gold ring-gold/30 hover:shadow-xl"
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {lang === "en" ? "Saving..." : "保存中..."}
                </span>
              ) : saved ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {lang === "en" ? "Saved!" : "已保存！"}
                </span>
              ) : (
                lang === "en" ? "Save" : "保存"
              )}
            </button>
          </div>
        </div>
      </div>
    </ModernAdminSection>
  );
}
