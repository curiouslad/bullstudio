"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  CreditCard,
  Database,
  LayoutDashboard,
  ListTodo,
  Settings,
} from "lucide-react";
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
  SidebarRail,
  SidebarSeparator,
} from "@bullstudio/ui/components/sidebar";
import { Logo } from "./Logo";
import { UserNav } from "./UserNav";
import { WorkspaceSelector } from "./WorkspaceSelector";

export function AppSidebar() {
  const pathname = usePathname();
  const { organizationSlug: orgSlug, workspace: workspaceSlug } = useParams();

  const isManageMode = pathname.includes("/manage/");

  const getItemUrl = (base: string) => {
    return `/${orgSlug}/${workspaceSlug ?? ""}${base}`;
  };

  const isActive = (href: string) => {
    const isBasePath = href === getItemUrl("");
    if (isBasePath) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isManageActive = (href: string) => {
    return pathname.startsWith(href);
  };

  const navItems = [
    {
      title: "Overview",
      href: getItemUrl(""),
      icon: LayoutDashboard,
    },
    {
      title: "Jobs",
      href: getItemUrl("/jobs"),
      icon: ListTodo,
    },
    {
      title: "Alerts",
      href: getItemUrl("/alerts"),
      icon: Bell,
    },
    {
      title: "Connections",
      href: getItemUrl("/connections"),
      icon: Database,
    },
  ];

  const manageNavItems = [
    {
      title: "Settings",
      href: `/${orgSlug}/manage/settings`,
      icon: Settings,
    },
    {
      title: "Billing",
      href: `/${orgSlug}/manage/billing`,
      icon: CreditCard,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Header with Logo */}
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        {isManageMode ? (
          <>
            {/* Back to Dashboard */}
            <SidebarGroup className="py-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Back to Dashboard"
                    className="h-10 transition-colors"
                  >
                    <Link href={`/${orgSlug}`}>
                      <ArrowLeft className="size-4" />
                      <span className="font-medium">Back to Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator className="mx-0" />

            {/* Organization Management Navigation */}
            <SidebarGroup className="py-4">
              <SidebarGroupLabel>Organization</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {manageNavItems.map((item) => {
                    const active = isManageActive(item.href);

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          className="h-10 transition-colors"
                        >
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          <>
            {/* Workspace Selector */}
            <SidebarGroup className="py-2">
              <WorkspaceSelector />
            </SidebarGroup>

            <SidebarSeparator className="mx-0" />

            {/* Main Navigation */}
            <SidebarGroup className="py-4">
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          className="h-10 transition-colors"
                        >
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer with User Nav */}
      <SidebarFooter>
        <SidebarSeparator className="mx-0 w-full" />
        <UserNav />
      </SidebarFooter>

      {/* Rail for resizing */}
      <SidebarRail />
    </Sidebar>
  );
}
