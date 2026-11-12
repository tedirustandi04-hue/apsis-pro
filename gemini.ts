import "server-only";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export type GeneratedQuestion = {
  number: number;
  material: string;
  indicator: string;
  cognitiveLevel: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questionType: string;
  stimulus: string | null;
  questionText: string;
  options: { label: string; content: string }[];
  correctAnswer: string[];
  explanation: string;
  scoringGuide: { maxScore: number; criteria: string[] };
  sourceReference: { title: string | null; page: number | null; status: string };
};

export type GeneratorInput = {
  schoolName: string;
  teacherName: string;
  educationLevel: string;
  phase: string;
  grade: number;
  subject: string;
  topic: string;
  cp: string;
  tp: string;
  totalQuestions: number;
  difficulty: { easy: number; medium: number; hard: number };
  cognitiveLevels: string[];
  questionType: string;
  optionCount: number;
  includeIllustration: boolean;
  customPrompt: string;
};

export async function generateQuestions(input: GeneratorInput) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi di server.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Anda adalah ahli asesmen pendidikan Indonesia.
Buat tepat ${input.totalQuestions} soal sesuai spesifikasi berikut.
Jenjang: ${input.educationLevel}; fase: ${input.phase}; kelas: ${input.grade}.
Sekolah: ${input.schoolName}; penyusun: ${input.teacherName}.
Mapel: ${input.subject}; topik: ${input.topic}.
CP: ${input.cp || "Tidak diberikan"}.
TP: ${input.tp}.
Jenis soal: ${input.questionType}; jumlah opsi: ${input.optionCount}.
Distribusi kesulitan: mudah ${input.difficulty.easy}%, sedang ${input.difficulty.medium}%, sulit ${input.difficulty.hard}%.
Level kognitif yang boleh digunakan: ${input.cognitiveLevels.join(", ")}.
Ilustrasi diminta: ${input.includeIllustration ? "Ya, berikan illustrationPrompt berupa deskripsi visual bila relevan; jangan mengarang URL gambar." : "Tidak"}.
Instruksi tambahan: ${input.customPrompt || "Tidak ada"}.

Ketentuan:
- Selaraskan setiap soal dengan TP.
- Gunakan bahasa sesuai usia peserta didik.
- Hindari ambiguitas dan opsi benar ganda untuk pilihan tunggal.
- Buat pengecoh yang masuk akal.
- Jangan mengarang sumber buku atau nomor halaman.
- Sertakan pembahasan dan pedoman skor.
- Jika informasi sumber tidak tersedia, tandai NEEDS_TEACHER_REFERENCE.
- Kembalikan JSON saja, tanpa Markdown.

Skema:
{
 "assessmentTitle": string,
 "questions": [{
  "number": number,
  "material": string,
  "indicator": string,
  "cognitiveLevel": "C1"|"C2"|"C3"|"C4"|"C5"|"C6",
  "difficulty": "EASY"|"MEDIUM"|"HARD",
  "questionType": string,
  "stimulus": string|null,
  "questionText": string,
  "options": [{"label": string, "content": string}],
  "correctAnswer": string[],
  "explanation": string,
  "scoringGuide": {"maxScore": number, "criteria": string[]},
  "sourceReference": {"title": string|null, "page": number|null, "status": string},
  "illustrationPrompt": string|null
 }]
}
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4
    }
  });

  const raw = response.text;
  if (!raw) throw new Error("AI tidak mengembalikan konten.");

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.questions) ||
      parsed.questions.length !== input.totalQuestions) {
    throw new Error("Struktur keluaran AI tidak sesuai jumlah soal.");
  }

  return parsed as {
    assessmentTitle: string;
    questions: (GeneratedQuestion & { illustrationPrompt?: string | null })[];
  };
}
