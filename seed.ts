import { PrismaClient, UserRole, EducationLevel, LearningOutcomeType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL belum diatur.");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "demo@apsispro.local";
  const passwordHash = await bcrypt.hash("ApsisDemo123!", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Guru Demo", passwordHash },
    create: {
      name: "Guru Demo",
      email,
      passwordHash,
      role: UserRole.SCHOOL_ADMIN
    }
  });

  const school = await prisma.school.upsert({
    where: { npsn: "00000000" },
    update: { name: "SD Contoh APSIS Pro" },
    create: {
      name: "SD Contoh APSIS Pro",
      npsn: "00000000",
      address: "Indonesia"
    }
  });

  await prisma.schoolMember.upsert({
    where: { userId_schoolId: { userId: user.id, schoolId: school.id } },
    update: { role: UserRole.SCHOOL_ADMIN },
    create: { userId: user.id, schoolId: school.id, role: UserRole.SCHOOL_ADMIN }
  });

  const curriculum = await prisma.curriculum.upsert({
    where: { id: "kurikulum-merdeka-demo" },
    update: { name: "Kurikulum Merdeka", year: "2026/2027" },
    create: { id: "kurikulum-merdeka-demo", name: "Kurikulum Merdeka", year: "2026/2027" }
  });

  const subject = await prisma.subject.upsert({
    where: { name: "Matematika" },
    update: {},
    create: { name: "Matematika" }
  });

  await prisma.learningOutcome.upsert({
    where: { id: "tp-matematika-demo" },
    update: { description: "Contoh TP: memahami dan menyelesaikan masalah pecahan sederhana." },
    create: {
      id: "tp-matematika-demo",
      curriculumId: curriculum.id,
      subjectId: subject.id,
      type: LearningOutcomeType.TP,
      code: "TP-DEMO-01",
      phase: "C",
      grade: 5,
      description: "Contoh TP: memahami dan menyelesaikan masalah pecahan sederhana."
    }
  });

  console.log("Seed selesai. Login demo:", email, "/ ApsisDemo123!");
  console.log("Sekolah:", school.name, "| Jenjang contoh:", EducationLevel.SD_MI);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
