"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface iAppProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  customStyle?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SubmitButton({
  text,
  variant,
  customStyle,
  disabled,
  icon,
}: iAppProps) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className={cn("", customStyle)} variant={variant}>
          <Loader className="size-7 mr-2 animate-spin" /> Aguarde...
        </Button>
      ) : (
        <Button
          type="submit"
          className={cn("", customStyle)}
          variant={variant}
          disabled={disabled}
        >
          {icon}
          {text}
        </Button>
      )}
    </>
  );
}
