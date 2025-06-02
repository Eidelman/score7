import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyRoute() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-[280px] lg:w-[380px] px-3 lg:px-5">
        <CardHeader className="text-center">
          <div className="mb-4 mx-auto flex size-20 items-center justify-center rounded-full bg-blue-100">
            <Mail className="size-12 text-blue-500" />
          </div>

          <CardTitle className="text-2xl font-bold">
            Verifique o seu e-mail
          </CardTitle>
          <CardDescription>
            Enviamos um link de verificação para seu endereço de e-mail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 rounded-md bg-yellow-50 border-yellow-300 p-4">
            <div className="flex items-center">
              <AlertCircle className="size-5 text-yellow-400" />

              <p className="text-sm font-medium text-yellow-700 ml-3">
                Não se esqueça de verificar sua caixa de spam!
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full",
              variant: "outline",
            })}
          >
            <ArrowLeft className="size-4 mr-2" /> Voltar para a página inicial
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
