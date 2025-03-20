import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface AdminSidebarProps {
  isOpen: boolean;
  currentPage: string;
}

export function AdminSidebar({ isOpen, currentPage }: AdminSidebarProps) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out",
      )}
    >
      <SidebarHeader className="p-4 border-b">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center space-x-2">
            <ShoppingCart
              className={cn("h-6 w-6 text-primary", !isOpen && "mx-auto")}
            />
            <span className={cn("font-bold text-lg", !isOpen && "hidden")}>
              POS Admin
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <BarChart3 className="h-5 w-5 text-gray-500" />
                <span className={"text-gray-700"}>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/categories"
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <Tag className="h-5 w-5 text-gray-500" />
                <span className={"text-gray-700"}>Categories</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/products"
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <Package className="h-5 w-5 text-gray-500" />
                <span className={"text-gray-700"}>Products</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/orders"
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <ShoppingCart className="h-5 w-5 text-gray-500" />
                <span className={"text-gray-700"}>Orders</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/users"
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span className={"text-gray-700"}>Users</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/settings"
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 text-gray-500" />
                <span className={"text-gray-700"}>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex items-center space-x-2 w-full rounded-md hover:bg-gray-100 text-left"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              <span className={"text-gray-700"}>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
