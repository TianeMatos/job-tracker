"use client";

import Link from "next/link";
import {
  Bookmark,
  KanbanSquare,
  LayoutDashboardIcon,
  LogOutIcon,
  LucideIcon,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import LogoMark from "../shared/Logo";
import { SidebarUser } from "@/lib/types/dashboard";
import { Button } from "../ui/button";
import { signOut } from "@/actions/auth";
import { useTransition } from "react";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const navItems: Array<{
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}> = [
  {
    id: "/dashboard",
    label: "Dashboard",
    shortLabel: "Início",
    icon: LayoutDashboardIcon,
  },
  {
    id: "/kanban",
    label: "Quadro Kanban",
    shortLabel: "Quadro Kanban",
    icon: KanbanSquare,
  },
  {
    id: "/saved-jobs",
    label: "Vagas salvas",
    shortLabel: "Vagas",
    icon: Bookmark,
  },
  {
    id: "/settings",
    label: "Configurações",
    shortLabel: "Config",
    icon: Settings,
  },
];

export default function AppSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const signOutTransition = () => {
    startTransition(async () => {
      await signOut();
      router.push("/login");
      router.refresh();
    }); 
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="relative z-10 px-3 py-8 flex-1 overflow-hidden bg-secondary border-border"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-12 blur-[90px] bg-primary sm:w-60" />

      <SidebarHeader>
        <LogoMark
          showText
          sizeText="text-[25px]"
          size={43}
          className="text-primary-foreground"
        />
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Navegação principal">
          <SidebarGroup>
            <SidebarGroupLabel className="my-5 px-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive(item.id)}
                        tooltip={item.shortLabel}
                        render={<Link href={item.id} />}
                        aria-current={isActive(item.id) ? "page" : undefined}
                        className={`h-11 px-3 my-0.5 font-medium transition-all ${isActive(item.id) ? "inset-shadow cursor-default pointer-events-none" : "text-muted/80 bg-transparent hover:text-muted hover:scale-105 hover:bg-primary/90"}`}
                      >
                        <item.icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>
      <SidebarFooter className="z-10 mt-auto pt-4 gap-2 flex-row items-center justify-between border-t border-muted/50">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-secondary">
          {getInitials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-primary-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Button
          variant={"ghost"}
          type="button"
          onClick={signOutTransition}
          disabled={isPending}
          aria-label="Sair"
          title="Sair"
          className="text-muted/80 dark:hover:bg-primary/90 dark:hover:text-primary-foreground
          cursor-pointer transition-colors"
        >
          <LogOutIcon size={22} aria-hidden="true" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
