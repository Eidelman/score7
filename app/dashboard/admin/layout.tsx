import { auth, signOut } from "@/app/utils/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const sidebarLinks = [
  { name: "Torneios", href: "/dashboard/admin/torneio" },
  { name: "Equipas", href: "/dashboard/admin/equipa" },
];

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex flex-row">
      <aside className="flex flex-col h-screen fixed justify-between gap-1 w-[260px] px-5 pt-28 pb-20 border-r">
        <ul className="p-0 m-0 list-none flex-1 space-y-3">
          {sidebarLinks.map((link) => (
            <li key={link.href} style={{ marginBottom: "1rem" }}>
              <Link
                href={link.href}
                className="block px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {session?.user?.email != null && (
          <form
            className="mt-16"
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              type="submit"
              className="w-full rounded-full"
              variant="default"
            >
              Sair
            </Button>
          </form>
        )}
      </aside>
      <main className="ml-[260px] p-8 w-full min-h-screen bg-zinc-50 pt-24">
        {children}
      </main>
    </div>
  );
}
