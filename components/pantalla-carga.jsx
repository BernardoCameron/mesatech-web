import { Logo } from "@/components/logo";

// Pantalla de espera mientras se revisa la sesion (evita mostrar el login un instante)
export function PantallaCarga({ texto = "Cargando..." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand text-white">
      <Logo />
      <p className="text-sm text-white/70">{texto}</p>
    </div>
  );
}
