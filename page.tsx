import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef3fa] p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-[#142b4a] p-10 text-white md:flex">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-xl font-black">A</div>
              <div><div className="text-xl font-bold">APSIS Pro</div><div className="text-xs text-blue-200">Assessment Intelligence</div></div>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-blue-200">Create · Assess · Analyze</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">Asesmen lebih cerdas, pembelajaran lebih bermakna.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100">Satu ruang kerja untuk merancang soal, melaksanakan asesmen, dan memahami hasil belajar.</p>
          </div>
          <p className="text-xs text-blue-200">© 2026 APSIS Pro · MVP</p>
        </section>
        <section className="p-7 sm:p-12">
          <div className="mb-8 md:hidden"><div className="text-2xl font-black text-[#142b4a]">APSIS Pro</div><p className="text-sm text-slate-500">Assessment Intelligence</p></div>
          <h2 className="text-2xl font-bold text-slate-900">Selamat datang</h2>
          <p className="mt-2 text-sm text-slate-500">Masuk untuk melanjutkan ke ruang kerja Anda.</p>
          <LoginForm />
          <div className="mt-8 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
            <b>Akun demo lokal</b><br/>Email: demo@apsispro.local<br/>Password: ApsisDemo123!<br/>
            Jalankan seed database terlebih dahulu.
          </div>
        </section>
      </div>
    </main>
  );
}
