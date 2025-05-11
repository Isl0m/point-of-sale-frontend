import { auth } from "@/auth";
import LoginForm from "@/components/login-form";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    return redirect("/admin/categories");
  }
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
