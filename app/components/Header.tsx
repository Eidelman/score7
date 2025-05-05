import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn, signOut } from "../utils/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./SubmitButton";

export default async function Header() {
  const session = await auth();
  console.log("Session: ", session?.user?.email);
  return (
    <div className="flex flex-row items-center justify-between h-12 px-10 bg-green-700">
      <Link href="/">Logo</Link>
      <div className="flex flex-row gap-8 items-center">
        <>
          <Link
            href="/encontrar-torneio"
            className={cn("uppercase text-secondary font-semibold text-sm")}
          >
            Encontrar um torneio
          </Link>
          <Link
            href="/dashboard/admin/torneio"
            className={cn("uppercase text-secondary font-semibold text-sm")}
          >
            Torneios
          </Link>
          <Link
            href="/dashboard/admin/equipa"
            className={cn("uppercase text-secondary font-semibold text-sm")}
          >
            Equipas
          </Link>
          <Link
            href="/criar-torneio"
            className={cn(
              "uppercase text-secondary font-semibold text-sm",
              session?.user ? "block" : "hidden"
            )}
          >
            Criar um torneio
          </Link>
        </>
        {session?.user?.email != null ? (
          <div className="flex flex-row items-center gap-2">
            <h1>{session.user.email}</h1>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit">Sair</Button>
            </form>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                INSCREVER-SE/ENTRAR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                action={async (formData) => {
                  "use server";
                  await signIn("nodemailer", formData);
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="email" className="">
                      E-mail
                    </Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>

                <SubmitButton text="Submeter" />
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
