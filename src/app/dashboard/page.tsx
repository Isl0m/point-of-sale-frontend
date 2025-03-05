import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  return (
    <main className="min-h-screen flex items-center flex-col justify-center p-4 bg-gray-50">
      <h1>Dashboard</h1>
      <img
        src={session?.user?.image || undefined}
        alt={session?.user?.name || "User"}
        className="w-16 h-16 rounded-full"
      />
      {session?.user?.name}
    </main>
  );
}
