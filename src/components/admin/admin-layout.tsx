"use client";

import type React from "react";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function AdminLayout({
  children,
  currentPage,
}: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { data: session } = useSession();

  return (
    <SidebarProvider
      className="flex min-h-screen bg-gray-50"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      {/* Sidebar */}
      <AdminSidebar isOpen={isOpen} currentPage={currentPage} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <SidebarTrigger />
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">
                {session?.user?.name}
              </span>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {session?.user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
