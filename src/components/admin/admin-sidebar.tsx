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
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface AdminSidebarProps {
  isOpen: boolean;
}

const menuItems = [
  {
    title: "Dashboard",
    link: "/admin/dashboard",
    Icon: BarChart3,
  },
  {
    title: "Categories",
    link: "/admin/categories",
    Icon: Tag,
  },
  {
    title: "Products",
    link: "/admin/products",
    Icon: Package,
  },
  {
    title: "Orders",
    link: "/admin/orders",
    Icon: ShoppingCart,
  },
  {
    title: "Users",
    link: "/admin/users",
    Icon: Users,
  },
];

export function AdminSidebar({ isOpen }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader className="p-4">
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
          {menuItems.map(({ title, link, Icon }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton asChild>
                <Link href={link}>
                  <Icon className="size-6" />
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut()} size={"lg"}>
              <LogOut className="size-6" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
