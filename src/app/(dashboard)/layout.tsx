import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/AppSidebar";
import LogoMark from "@/components/shared/Logo";
import { requireAuth } from "@/lib/auth/auth-session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAuth();
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar user={session.user} />
      <SidebarInset className="h-screen overflow-hidden">
        <header className="h-20 flex px-4 items-center justify-between gap-2 border-b border-b-border bg-secondary md:hidden">
          <SidebarTrigger
            size={"icon-lg"}
            className="text-secondary-foreground hover:bg-accent-foreground"
          />
          <LogoMark
            showText
            sizeText="text-2xl"
            size={40}
            className="text-secondary-foreground"
          />
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto max-w-360 px-4 py-7 sm:px-6 sm:py-9 lg:p-8 xl:max-w-400">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
