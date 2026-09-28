import { redirect } from "next/navigation";
import { getCurrentUser } from "@backend/auth/session";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  redirect(user.role === "admin" ? "/admin" : "/intern");
}