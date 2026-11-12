import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <div className="min-h-screen md:flex"><Sidebar user={session}/><main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-9">{children}</main></div>;
}
