"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, Inbox, LogOut, Plus, Tag } from "lucide-react";
import { Logo } from "@/components/logo";
import { MODO_ENTRA } from "@/lib/entra";
import { useSesion } from "@/components/sesion-provider";
import { PantallaCarga } from "@/components/pantalla-carga";

const TODOS = ["Cliente", "Operador", "Administrador"];

const MENU = [
  { href: "/nueva-solicitud", texto: "Nueva solicitud", Icono: Plus, roles: TODOS },
  { href: "/mis-solicitudes", texto: "Mis solicitudes", Icono: ClipboardList, roles: TODOS },
  { href: "/solicitudes", texto: "Todas las solicitudes", Icono: Inbox, roles: ["Operador", "Administrador"] },
  { href: "/categorias", texto: "Categorías", Icono: Tag, roles: ["Administrador"] },
];

// Barra lateral y proteccion de rutas (solo en el front; el BFF vuelve a validar el rol)
export default function LayoutApp({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { usuario, cargando, salir } = useSesion();

  const itemActual = MENU.find((m) => m.href === pathname);

  useEffect(() => {
    if (cargando) return;
    if (!usuario) router.replace("/login");
    else if (itemActual && !itemActual.roles.includes(usuario.rol)) router.replace("/mis-solicitudes");
  }, [usuario, cargando, itemActual, router]);

  if (cargando || !usuario) return <PantallaCarga />;

  function cerrarSesion() {
    salir();
    // Con Microsoft, salir() redirige solo; en modo prueba se vuelve al login
    if (!MODO_ENTRA) router.push("/login");
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex flex-col gap-4 bg-sidebar px-4 pt-4 text-sidebar-foreground lg:min-h-screen lg:w-60 lg:shrink-0 lg:gap-6 lg:p-5">
        {/* Celular: logo y usuario en una fila. Escritorio: solo el logo */}
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-[13px] text-white/70">{usuario.rol}</span>
            <button
              onClick={cerrarSesion}
              aria-label="Cerrar sesión"
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-3 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
          {MENU.filter((m) => m.roles.includes(usuario.rol)).map(({ href, texto, Icono }) => {
            const activo = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                  activo
                    ? "bg-sidebar-accent font-medium lg:shadow-[inset_3px_0_0_var(--mint)]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icono className="size-4" />
                {texto}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden items-center gap-3 border-t border-sidebar-border pt-4 lg:flex">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-medium">
            {usuario.nombre
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{usuario.nombre}</div>
            <div className="text-xs text-white/60">{usuario.rol}</div>
          </div>
          <button
            onClick={cerrarSesion}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}
