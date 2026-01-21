"use client";

import { useState } from "react";

export default function ApplicationForm({ lang }) {
  const [form, setForm] = useState({ name: "", role: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(lang === "en" ? "Submitting..." : "提交中...");
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setStatus(lang === "en" ? "Submit failed" : "提交失败");
      return;
    }
    setForm({ name: "", role: "", email: "", message: "" });
    setStatus(lang === "en" ? "Submitted" : "已提交");
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
        placeholder={lang === "en" ? "Full name" : "姓名"}
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
      />
      <input
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
        placeholder={lang === "en" ? "Role / Organization" : "职位/机构"}
        value={form.role}
        onChange={(event) => setForm({ ...form, role: event.target.value })}
      />
      <input
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
        placeholder={lang === "en" ? "Email" : "邮箱"}
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
      />
      <textarea
        className="h-28 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
        placeholder={lang === "en" ? "Tell us about your mission" : "简单介绍你的方向"}
        value={form.message}
        onChange={(event) => setForm({ ...form, message: event.target.value })}
      />
      <button type="submit" className="btn-primary w-full">
        {lang === "en" ? "Submit Request" : "提交申请"}
      </button>
      {status && <p className="text-xs uppercase tracking-[0.3em] text-gold">{status}</p>}
    </form>
  );
}
