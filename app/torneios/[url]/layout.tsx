import React, { ReactNode } from "react";
import { TorneioMenu } from "../../components/TorneioMenu";

export default function TorneioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-4 gap-4">
      <h1>Torneio title</h1>
      <header className="flex flex-row gap-x-8">
        <TorneioMenu />
      </header>
      {children}
    </div>
  );
}
