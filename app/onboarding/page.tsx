"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useForm } from "react-hook-form";
import { updateUser } from "@/actions/user.actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = {
  name: string;
};

export default function Onboarding() {
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.name) {
      return;
    }
    await updateUser({
      name: data.name,
    });
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Você está quase terminando!</CardTitle>
          <CardDescription>Insira os seus dados</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="col-span-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...register("name", { required: true })} />
            </div>

            <Button type="submit" size="sm">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
