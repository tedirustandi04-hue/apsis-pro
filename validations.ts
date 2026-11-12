import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128)
});

export const generateSchema = z.object({
  schoolName: z.string().min(2).max(160),
  teacherName: z.string().min(2).max(120),
  educationLevel: z.enum(["SD_MI", "SMP_MTS", "SMA_MA_SMK"]),
  phase: z.enum(["A", "B", "C", "D", "E", "F"]),
  grade: z.number().int().min(1).max(12),
  subject: z.string().min(2).max(100),
  topic: z.string().min(2).max(200),
  cp: z.string().max(3000).optional().default(""),
  tp: z.string().min(5).max(3000),
  totalQuestions: z.number().int().min(1).max(50),
  difficulty: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100)
  }),
  cognitiveLevels: z.array(z.enum(["C1", "C2", "C3", "C4", "C5", "C6"])).min(1),
  questionType: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER", "ESSAY"]),
  optionCount: z.number().int().min(3).max(5).default(4),
  includeIllustration: z.boolean().default(false),
  customPrompt: z.string().max(2000).optional().default("")
}).refine(v => v.difficulty.easy + v.difficulty.medium + v.difficulty.hard === 100, {
  message: "Total distribusi kesulitan harus tepat 100%."
});
