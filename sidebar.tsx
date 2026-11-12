"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Settings2, Sparkles, LibraryBig, ClipboardList, ChartNoAxesCombined, FileText, LogOut, Menu, X, GraduationCap } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/setup", label: "Identitas & Kurikulum", icon: Settings2 },
  { href: "/generator", label: "AI Question Generator", icon: Sparkles },
  { href: "/question-bank", label: "Bank Soal", icon: LibraryBig },
  { href: "/assessments", label: "Asesmen", icon: ClipboardList },
  { href: "/analytics", label: "Analisis", icon: ChartNoAxesCombined },
  { href: "/reports", label: "Laporan", icon: FileText }
];

export function Sidebar({ user }: { user: { name: string; role: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return <>
    <button onClick={() => setOpen(!open)} className="fixed left-4 top-4 z-50 rounded-lg bg-[#142b4a] p-2 text-white shadow md:hidden" aria-label="Buka menu">{open ? <X size={20}/> : <Menu size={20}/>}</button>
    {open && <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/30 md:hidden"/>}
    <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#142b4a] px-5 py-7 text-white transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0`}>
      <Link href="/dashboard" className="mb-10 flex items-center gap-3 pl-2" onClick={() => setOpen(false)}>
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><GraduationCap size={25}/></div>
        <div><div className="text-xl font-bold">APSIS Pro</div><div className="text-[10px] tracking-widest text-blue-200">ASSESSMENT INTELLIGENCE</div></div>
      </Link>
      <p className="mb-3 px-3 text-[10px] font-bold tracking-[.18em] text-blue-300">WORKSPACE</p>
      <nav className="space-y-1">
        {nav.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "bg-white text-[#142b4a] font-semibold shadow" : "text-blue-100 hover:bg-white/10"}`}><Icon size={18}/>{item.label}</Link>;
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">{user.name}</div>
        <div className="mt-1 text-xs text-blue-200">{user.role.replaceAll("_", " ")}</div>
        <button onClick={logout} className="mt-4 flex items-center gap-2 text-xs text-blue-100 hover:text-white"><LogOut size={15}/> Keluar</button>
      </div>
    </aside>
  </>;
}
