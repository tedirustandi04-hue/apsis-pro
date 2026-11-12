import { GeneratorForm } from "@/components/generator-form";

export default function GeneratorPage() {
  return <div className="mx-auto max-w-5xl"><p className="text-sm font-medium text-blue-700">AI Assessment Studio</p><h1 className="mt-1 text-3xl font-bold">AI Question Generator</h1><p className="mt-2 text-sm text-slate-500">Susun spesifikasi asesmen. Hasil AI perlu ditinjau dan disetujui guru sebelum digunakan.</p><div className="mt-7"><GeneratorForm/></div></div>;
}
