import { auth } from "../utils/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Logo from "@/public/schoolLogo.png";
import Image from "next/image";
import ActiveLink from "./ActiveLink";

export default async function Header() {
  const session = await auth();

  return (
    <nav className="flex flex-row items-center justify-between h-20 px-24 w-full shadow-sm bg-green-500 fixed top-0 z-50">
      <Link href="/" className={cn("flex flex-row items-center gap-0 text-xs")}>
        <Image src={Logo} alt="Logo" className="size-14" />
        <span>Colégio STP</span>
      </Link>
      <div className="flex flex-row space-x-14 items-center text-zinc-50">
        <>
          {session?.user?.email ? (
            <ActiveLink href="/dashboard/admin/torneio">
              Painel de Administrador
            </ActiveLink>
          ) : (
            <>
              <ActiveLink href="/">Inicio</ActiveLink>
              <ActiveLink href="/torneios">Torneios</ActiveLink>
              <ActiveLink href="/sobre-nos">Sobre Nós</ActiveLink>
            </>
          )}
        </>
        {!session?.user?.email && (
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full w-[100px] text-zinc-900"
            )}
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
