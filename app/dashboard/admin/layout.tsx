import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const sidebarLinks = [
  { name: "Torneios", href: "/dashboard/admin/torneio" },
  { name: "Equipas", href: "/dashboard/admin/equipa" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside className="flex flex-col gap-1 w-[220px] bg-[#1a202c] text-white px-4 py-6">
        <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem" }}>
          Admin Panel
        </h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sidebarLinks.map((link) => (
              <li key={link.href} style={{ marginBottom: "1rem" }}>
                <a
                  href={link.href}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, background: "#f7fafc", padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
