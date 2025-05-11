"use client";

import type React from "react";

import { useState } from "react";
import { ModeToggle } from "../mode-toggler";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 52)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      {/* Sidebar */}
      <AdminSidebar isOpen={isOpen} />

      {/* Main content */}
      <SidebarInset className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium">{title}</h1>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
