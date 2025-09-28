"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) redirect("/auth/login");

  return <h1>Welcome Admin, {session.user?.email}</h1>;
}
