import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminMessagesClient from "@/features/admin/messages/components/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "administrator") {
    redirect("/"); // or /login, or /not-authorized
  }

  return <AdminMessagesClient />;
}
