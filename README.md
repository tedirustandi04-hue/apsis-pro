# APSIS Pro — MVP Starter

Starter project untuk APSIS Pro (Aplikasi Pembuat Soal, Asesmen & Analisis Evaluasi Pembelajaran).

## Yang tersedia pada starter ini

- Next.js App Router + TypeScript + Tailwind CSS v4.
- PostgreSQL + Prisma 6 dengan schema sekolah, anggota sekolah, kurikulum, CP/TP, mata pelajaran, asesmen, soal, dan opsi.
- Login email/password demo dengan bcrypt dan session JWT HttpOnly cookie.
- Role dasar: SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT.
- Dashboard responsif dan halaman konfigurasi identitas.
- Form generator soal dengan Gemini API server-side dan validasi Zod.
- Contoh seed akun demo.

## Belum termasuk (sengaja ditunda)

- Registrasi publik, reset password, MFA, manajemen pengguna/role lengkap.
- CRUD CP/TP dan sekolah.
- Persistensi hasil generasi AI ke bank soal (saat ini hasil tampil sebagai draf).
- Alur review/approval dan versioning.
- Generator DOCX/XLSX/PDF.
- Simulator ujian, sinkronisasi offline, statistik nilai dan CTT.
- Lisensi pembayaran.

## Prasyarat

- Node.js 20.9+ (disarankan Node 22 LTS).
- npm.
- PostgreSQL 15+.
- Gemini API key untuk menguji generasi AI.

## Instalasi lokal

1. Salin file `.env.example` menjadi `.env`.
2. Isi `DATABASE_URL`.
3. Buat secret:
   ```bash
   openssl rand -base64 32
   ```
   Tempel hasilnya pada `AUTH_SECRET`.
4. Isi `GEMINI_API_KEY` jika ingin mencoba generator AI.
5. Instal dependensi:
   ```bash
   npm install
   ```
6. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```
7. Buat migrasi awal:
   ```bash
   npm run db:migrate -- --name init
   ```
8. Isi data demo:
   ```bash
   npm run db:seed
   ```
9. Jalankan:
   ```bash
   npm run dev
   ```
10. Buka http://localhost:3000.

Akun seed lokal:
- Email: `demo@apsispro.local`
- Password: `ApsisDemo123!`

Segera ganti/hapus akun demo sebelum deployment. Jangan gunakan kredensial demo di produksi.

## Pemeriksaan

```bash
npm run typecheck
npm run lint
npm run build
```

Uji manual:
1. Login dengan akun demo.
2. Dashboard menampilkan sekolah dan jumlah asesmen/soal.
3. Buka Identitas & Kurikulum.
4. Buka AI Question Generator.
5. Pastikan request tanpa `GEMINI_API_KEY` menampilkan pesan konfigurasi yang jelas.
6. Dengan API key valid, generate 5 soal dan periksa setiap butir secara manual.

## Keamanan penting

- `GEMINI_API_KEY` dan `AUTH_SECRET` hanya di server. Jangan memakai prefix `NEXT_PUBLIC_`.
- Session memakai HttpOnly, SameSite=Lax cookie; production menggunakan Secure.
- Tambahkan rate limiting, CSRF/origin policy, audit log, reset password, dan pengelolaan role sebelum produksi.
- Endpoint AI saat ini memerlukan login tetapi belum memiliki rate limit per akun. Terapkan rate limit dan batas biaya sebelum membuka ke banyak pengguna.
- Isolasi data sekolah harus ditegakkan di setiap query; schema awal menyediakan school membership, tetapi belum semua route CRUD dibuat.
- Jangan pernah mengirim `correctAnswer` ke browser peserta ujian.
- Data siswa merupakan data pribadi; batasi akses dan retensi sesuai kebijakan sekolah dan hukum yang berlaku.

## GitHub

```bash
git init
git add .
git commit -m "chore: initialize APSIS Pro MVP"
git branch -M main
git remote add origin https://github.com/USERNAME/apsis-pro.git
git push -u origin main
```

## Catatan integrasi Gemini

SDK resmi yang digunakan adalah `@google/genai`. API key dibaca di `src/lib/ai/gemini.ts` dari environment server. Output diminta sebagai JSON, kemudian diperiksa lagi jumlah soal dan struktur dasar. Untuk produksi, tambahkan schema validation Zod khusus output AI, retry terkontrol, logging tanpa menyimpan rahasia, dan human review.
