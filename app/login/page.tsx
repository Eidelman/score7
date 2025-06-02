import React from "react";
import { SubmitButton } from "../components/SubmitButton";
import { auth, signIn } from "../utils/auth";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import HeroImg from "@/public/football.jpg";

export default async function LoginRoute() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard/admin/torneio");
  }

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center px-28">
      <div className="absolute inset-0 z-1">
        <Image src={HeroImg} alt="Logo" fill />
      </div>
      <form
        action={async (formData) => {
          "use server";
          await signIn("nodemailer", formData);
        }}
        className="flex flex-col space-y-4 max-w-6xl mx-auto h-screen justify-center z-10"
      >
        <h1 className="font-mono uppercase pb-5">Entar como administrador</h1>
        <Input
          type="email"
          name="email"
          required
          placeholder="Digite seu e-mail"
          className="w-full"
        />

        <SubmitButton text="Entrar" customStyle="w-full" />
      </form>
    </div>
  );
}
