import { Ban } from "lucide-react";

interface iAppProps {
  title: string;
  description?: string;
}

export function EmptyState({ description, title }: iAppProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
      <div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-muted-foreground">
        {title}
      </h2>
      <p className="mb-8 mt-2 text-sm text-muted-foreground max-w-xm mx-auto text-center">
        {description}
      </p>
    </div>
  );
}
