"use client";

import { useState } from "react";

type Result = { assessmentTitle: string; questions: Array<Record<string, unknown>> };

export function GeneratorForm() {
  const [form, setForm] = useState({
    schoolName: "SD Contoh APSIS Pro", teacherName: "Guru Demo",
    educationLevel: "SD_MI", phase: "C", grade: 5,
    subject: "Matematika", topic: "Pecahan",
    cp: "", tp: "Peserta didik mampu membandingkan dan menyelesaikan masalah pecahan sederhana.",
    totalQuestions: 5, difficulty: { easy: 30, medium: 50, hard: 20 },
    cognitiveLevels: ["C2", "C3", "C4"], questionType: "SINGLE_CHOICE",
    optionCount: 4, includeIllustration: false, customPrompt: ""
  });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setResult(null); setLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generasi gagal.");
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally { setLoading(false); }
  }

  const field = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50";
  return <div className="grid gap-6">
    <form onSubmit={generate} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-6"><h2 className="font-bold">Identitas & konteks pembelajaran</h2><p className="mt-1 text-xs text-slate-500">Lengkapi data agar AI memahami konteks asesmen.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Nama sekolah<input className={field} value={form.schoolName} onChange={e => update("schoolName", e.target.value)} required/></label>
        <label className="text-sm font-medium">Nama guru<input className={field} value={form.teacherName} onChange={e => update("teacherName", e.target.value)} required/></label>
        <label className="text-sm font-medium">Jenjang<select className={field} value={form.educationLevel} onChange={e => update("educationLevel", e.target.value)}><option value="SD_MI">SD / MI</option><option value="SMP_MTS">SMP / MTs</option><option value="SMA_MA_SMK">SMA / MA / SMK</option></select></label>
        <label className="text-sm font-medium">Fase<select className={field} value={form.phase} onChange={e => update("phase", e.target.value)}>{["A","B","C","D","E","F"].map(x => <option key={x}>{x}</option>)}</select></label>
        <label className="text-sm font-medium">Kelas<input className={field} type="number" min={1} max={12} value={form.grade} onChange={e => update("grade", Number(e.target.value))}/></label>
        <label className="text-sm font-medium">Mata pelajaran<input className={field} value={form.subject} onChange={e => update("subject", e.target.value)}/></label>
        <label className="text-sm font-medium sm:col-span-2">Topik / materi<input className={field} value={form.topic} onChange={e => update("topic", e.target.value)}/></label>
        <label className="text-sm font-medium sm:col-span-2">Capaian Pembelajaran (CP)<textarea className={field} rows={2} value={form.cp} onChange={e => update("cp", e.target.value)} placeholder="Opsional; masukkan CP yang telah diverifikasi."/></label>
        <label className="text-sm font-medium sm:col-span-2">Tujuan Pembelajaran (TP)<textarea className={field} rows={3} value={form.tp} onChange={e => update("tp", e.target.value)} required/></label>
      </div>
      <div className="my-7 border-t border-slate-100"/>
      <h2 className="font-bold">Spesifikasi soal</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Jumlah soal (maks. 50)<input className={field} type="number" min={1} max={50} value={form.totalQuestions} onChange={e => update("totalQuestions", Number(e.target.value))}/></label>
        <label className="text-sm font-medium">Bentuk soal<select className={field} value={form.questionType} onChange={e => update("questionType", e.target.value)}><option value="SINGLE_CHOICE">Pilihan ganda</option><option value="MULTIPLE_CHOICE">Pilihan ganda kompleks</option><option value="TRUE_FALSE">Benar / Salah</option><option value="SHORT_ANSWER">Isian singkat</option><option value="ESSAY">Uraian / Esai</option></select></label>
        <label className="text-sm font-medium">Jumlah opsi (pilihan ganda)<select className={field} value={form.optionCount} onChange={e => update("optionCount", Number(e.target.value))}>{[3,4,5].map(x => <option key={x} value={x}>{x} opsi</option>)}</select></label>
      </div>
      <div className="mt-5"><p className="text-sm font-semibold">Distribusi tingkat kesulitan (%)</p><div className="mt-3 grid grid-cols-3 gap-3">{(["easy","medium","hard"] as const).map(k => <label key={k} className="text-xs font-medium capitalize text-slate-600">{k === "easy" ? "Mudah" : k === "medium" ? "Sedang" : "Sulit"}<input className={field} type="number" min={0} max={100} value={form.difficulty[k]} onChange={e => update("difficulty", {...form.difficulty, [k]: Number(e.target.value)})}/></label>)}</div><p className={`mt-2 text-xs ${form.difficulty.easy + form.difficulty.medium + form.difficulty.hard === 100 ? "text-emerald-700" : "text-red-600"}`}>Total: {form.difficulty.easy + form.difficulty.medium + form.difficulty.hard}% (harus 100%)</p></div>
      <div className="mt-5"><p className="text-sm font-semibold">Level kognitif</p><div className="mt-3 flex flex-wrap gap-2">{["C1","C2","C3","C4","C5","C6"].map(level => <label key={level} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${form.cognitiveLevels.includes(level) ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-500"}`}><input className="sr-only" type="checkbox" checked={form.cognitiveLevels.includes(level)} onChange={e => update("cognitiveLevels", e.target.checked ? [...form.cognitiveLevels, level] : form.cognitiveLevels.filter(x => x !== level))}/>{level}</label>)}</div></div>
      <label className="mt-5 flex items-center gap-3 text-sm"><input type="checkbox" checked={form.includeIllustration} onChange={e => update("includeIllustration", e.target.checked)} className="h-4 w-4 accent-blue-700"/> Sertakan prompt ilustrasi jika relevan</label>
      <label className="mt-5 block text-sm font-medium">Instruksi tambahan<textarea className={field} rows={2} value={form.customPrompt} onChange={e => update("customPrompt", e.target.value)} placeholder="Contoh: gunakan konteks kehidupan sehari-hari di lingkungan sekitar."/></label>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={loading || form.difficulty.easy + form.difficulty.medium + form.difficulty.hard !== 100 || form.cognitiveLevels.length === 0} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d4f91] px-5 py-3 font-semibold text-white hover:bg-[#173f75] disabled:opacity-50">{loading ? "AI sedang menyusun soal..." : "Generate soal dengan Gemini"}</button>
      <p className="mt-3 text-center text-xs text-slate-400">Hasil AI adalah draf. Guru wajib memeriksa kunci, materi, bahasa, dan kesesuaian TP.</p>
    </form>
    {result && <section className="rounded-2xl border border-emerald-200 bg-white p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Hasil generasi</span><h2 className="mt-1 text-xl font-bold">{result.assessmentTitle}</h2></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Perlu review guru</span></div><div className="mt-5 space-y-4">{result.questions.map((q, i) => <article key={i} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap gap-2 text-xs"><b>Soal {String(q.number)}</b><span className="text-slate-500">{String(q.cognitiveLevel)} · {String(q.difficulty)}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{String(q.questionText)}</p>{Array.isArray(q.options) && <ol className="mt-3 space-y-2 text-sm">{(q.options as Array<{label:string;content:string}>).map(o => <li key={o.label}><b>{o.label}.</b> {o.content}</li>)}</ol>}<details className="mt-4 rounded-lg bg-slate-50 p-3 text-sm"><summary className="cursor-pointer font-semibold text-slate-700">Lihat kunci & pembahasan (khusus guru)</summary><p className="mt-2"><b>Kunci:</b> {JSON.stringify(q.correctAnswer)}</p><p className="mt-2 text-slate-600">{String(q.explanation)}</p></details></article>)}</div><button onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))} className="mt-5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Salin JSON hasil</button></section>}
  </div>;
}
