import { cn } from "@/lib/utils";

// Select nativo con el estilo de los inputs del proyecto
export function CampoSelect({ className, ...props }) {
  return (
    <select
      className={cn(
        "h-9 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
