"use client";

import { useState } from "react";

export default function ImageUpload({ label, value, onChange, placeholder }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      setError("图片大小不能超过 2MB");
      return;
    }

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      setError("只能上传图片文件");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "上传失败");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError(err.message || "上传失败");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/80">{label}</label>
      )}

      <div className="flex max-w-2xl gap-3">
        {/* URL 输入框 */}
        <input
          type="text"
          className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition-all focus:border-gold/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold/20"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "输入图片URL或上传图片"}
        />

        {/* 上传按钮 */}
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <div
            className={`rounded-lg border border-gold/30 px-4 py-2.5 text-sm font-medium transition-all ${
              uploading
                ? "cursor-not-allowed bg-gold/20 text-white/50"
                : "bg-gold/10 text-gold hover:bg-gold/20"
            }`}
          >
            {uploading ? "上传中..." : "📤 上传"}
          </div>
        </label>
      </div>

      {/* 状态提示 */}
      {error && (
        <p className="text-xs text-red-400">❌ {error}</p>
      )}
      {value && !error && (
        <p className="text-xs text-green-400">✓ 图片已设置，查看右侧预览</p>
      )}

      {/* 简洁提示 */}
      {!value && !error && (
        <p className="text-xs text-white/40">
          支持 JPEG、PNG、WebP、GIF，最大 2MB
        </p>
      )}
    </div>
  );
}
