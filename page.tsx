import { getSession, getUserSchool } from "@/lib/auth";

export default async function SetupPage() {
  const session = await getSession();
  if (!session) return null;
  const membership = await getUserSchool(session.id);
  return <div className="mx-auto max-w-4xl">
    <p className="text-sm font-medium text-blue-700">Konfigurasi awal</p><h1 className="mt-1 text-3xl font-bold">Identitas & Kurikulum</h1>
    <p className="mt-2 text-sm text-slate-500">Ringkasan profil yang terhubung dengan akun Anda.</p>
    <div className="mt-7 grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl border bg-white p-6"><h2 className="font-bold">Identitas pengguna</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Nama</dt><dd className="font-medium">{session.name}</dd></div><div><dt className="text-slate-500">Email</dt><dd className="font-medium">{session.email}</dd></div><div><dt className="text-slate-500">Role</dt><dd className="font-medium">{session.role}</dd></div></dl></section>
      <section className="rounded-2xl border bg-white p-6"><h2 className="font-bold">Satuan pendidikan</h2>{membership ? <dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Nama sekolah</dt><dd className="font-medium">{membership.school.name}</dd></div><div><dt className="text-slate-500">NPSN</dt><dd className="font-medium">{membership.school.npsn || "Belum diisi"}</dd></div><div><dt className="text-slate-500">Alamat</dt><dd className="font-medium">{membership.school.address || "Belum diisi"}</dd></div></dl> : <p className="mt-4 text-sm text-amber-700">Akun belum terhubung ke sekolah.</p>}</section>
    </div>
    <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-blue-900"><b>Ruang lingkup kurikulum MVP</b><br/>Database sudah menyediakan entitas Kurikulum, Mata Pelajaran, CP/TP, fase A–F, dan kelas 1–12. Form CRUD kurikulum dan pemetaan CP/TP menjadi pekerjaan sprint berikutnya.</div>
  </div>;
}
