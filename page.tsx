import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession, getUserSchool } from "@/lib/auth";
import { Sparkles, ClipboardCheck, LibraryBig, School, ArrowUpRight, FileText, ChartNoAxesCombined } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;
  const membership = await getUserSchool(session.id);
  const [assessmentCount, questionCount] = await Promise.all([
    prisma.assessment.count({ where: { createdById: session.id } }),
    prisma.question.count({ where: { assessment: { createdById: session.id } } })
  ]);

  const cards = [
    { label: "Asesmen dibuat", value: assessmentCount, icon: ClipboardCheck },
    { label: "Soal tersimpan", value: questionCount, icon: LibraryBig },
    { label: "Sekolah terhubung", value: membership ? 1 : 0, icon: School }
  ];

  return <div className="mx-auto max-w-7xl">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-medium text-blue-700">Ruang kerja pendidik</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1><p className="mt-2 text-sm text-slate-500">Selamat datang, {session.name}. Siapkan asesmen pembelajaran Anda.</p></div>
      <Link href="/generator" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d4f91] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#173f75]"><Sparkles size={17}/> Buat soal dengan AI</Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(card => { const Icon = card.icon; return <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{card.label}</span><span className="rounded-xl bg-blue-50 p-2 text-blue-700"><Icon size={19}/></span></div><div className="mt-4 text-3xl font-bold text-slate-900">{card.value}</div></div>; })}
    </div>
    <div className="mt-7 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Mulai dari sini</h2><p className="mt-1 text-xs text-slate-500">Alur kerja inti APSIS Pro MVP</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">MVP</span></div>
        <div className="mt-6 space-y-4">
          {[["01","Lengkapi identitas & kurikulum","Masukkan sekolah, mata pelajaran, CP dan TP.","/setup"],["02","Generate soal dengan AI","Susun spesifikasi lalu tinjau hasil generasi.","/generator"],["03","Kelola bank soal","Simpan dan siapkan soal untuk asesmen.","/question-bank"]].map(([n,title,desc,href]) => <Link key={n} href={href} className="flex gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{n}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800">{title}</span><span className="mt-1 block text-xs text-slate-500">{desc}</span></span><ArrowUpRight size={17} className="text-slate-400"/></Link>)}
        </div>
      </section>
      <section className="rounded-2xl bg-gradient-to-br from-[#17365d] to-[#2563a6] p-6 text-white">
        <div className="flex items-center gap-2 text-blue-100"><Sparkles size={18}/><span className="text-xs font-semibold uppercase tracking-widest">AI Assessment Studio</span></div>
        <h2 className="mt-5 text-2xl font-bold">Dari tujuan belajar menjadi asesmen bermakna.</h2>
        <p className="mt-3 text-sm leading-6 text-blue-100">Buat rancangan soal sesuai jenjang, fase, tujuan pembelajaran, tingkat kesulitan, dan level kognitif.</p>
        <Link href="/generator" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#17365d]">Buka generator <ArrowUpRight size={16}/></Link>
      </section>
    </div>
    <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5">
      <div className="flex items-center gap-3"><ChartNoAxesCombined className="text-slate-500"/><div><h3 className="text-sm font-semibold">Analisis pembelajaran</h3><p className="mt-1 text-xs text-slate-500">Modul statistik nilai, ketuntasan, dan CTT disiapkan pada fase berikutnya.</p></div></div>
    </div>
  </div>;
}
