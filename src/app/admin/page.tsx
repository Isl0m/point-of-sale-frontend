import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect to orders page by default
  redirect("/admin/orders");
}
