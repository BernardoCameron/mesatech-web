"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { FondoEstados } from "@/components/fondo-estados";
import { TicketVivo } from "@/components/ticket-vivo";
import { useSesion } from "@/components/sesion-provider";
import { USUARIOS_PRUEBA } from "@/lib/sesion";
import { MODO_ENTRA } from "@/lib/entra";

// Cada elemento entra con un pequeño retraso (ver .entrada en globals.css)
function retraso(ms) {
  return { "--retraso": `${ms}ms` };
}

export default function Login() {
  const router = useRouter();
  const { usuario, cargando, entrar, entrarConMicrosoft, errorLogin } = useSesion();

  // Si ya hay sesion, se va directo a la pantalla principal
  useEffect(() => {
    if (cargando || !usuario) return;
    router.replace(usuario.rol === "Cliente" ? "/mis-solicitudes" : "/solicitudes");
  }, [usuario, cargando, router]);

  function ingresar(usuario) {
    entrar(usuario.id);
    router.push(usuario.rol === "Cliente" ? "/mis-solicitudes" : "/solicitudes");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative flex flex-col justify-between gap-12 overflow-hidden bg-brand p-8 text-white lg:p-16">
        <FondoEstados />

        <Logo className="entrada relative" />

        <div className="relative max-w-xl">
          <h1
            className="entrada text-[34px] font-medium leading-[1.05] tracking-[-0.03em] lg:text-[56px]"
            style={retraso(120)}
          >
            Cada solicitud, con dueño y estado.
          </h1>
          <p className="entrada mt-6 max-w-md text-lg text-white/80" style={retraso(240)}>
            Crea, asigna y resuelve solicitudes en un solo lugar. Sin correos perdidos ni llamadas
            repetidas.
          </p>
        </div>

        <div className="entrada relative" style={retraso(420)}>
          <TicketVivo />
        </div>
      </section>

      <section className="flex items-center justify-center p-8 lg:justify-end">
        <div
          className="entrada w-full rounded-xl lg:max-w-[420px] lg:bg-card lg:p-8"
          style={retraso(200)}
        >
          <h2 className="text-2xl font-medium tracking-tight">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {MODO_ENTRA ? "Entra con tu cuenta de Microsoft" : "Elige un perfil de prueba para entrar"}
          </p>

          {errorLogin && (
            <div className="mt-4 rounded-lg bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">{errorLogin}</div>
          )}

          {MODO_ENTRA && (
            <Button
              variant="mint"
              size="lg"
              className="entrada mt-6 h-12 w-full"
              style={retraso(380)}
              onClick={entrarConMicrosoft}
            >
              Continuar con Microsoft
            </Button>
          )}

          {!MODO_ENTRA && (
          <div className="mt-6 space-y-3">
            {USUARIOS_PRUEBA.map((u, i) => (
              <Button
                key={u.id}
                variant={u.rol === "Administrador" ? "mint" : "secondary"}
                className={`entrada h-14 w-full flex-col items-start justify-center gap-0.5 px-4 ${
                  u.rol === "Administrador" ? "" : "text-primary"
                }`}
                style={retraso(380 + i * 90)}
                onClick={() => ingresar(u)}
              >
                <span className="text-sm font-medium">{u.rol}</span>
                <span className="text-[13px] font-normal opacity-80">{u.descripcion}</span>
              </Button>
            ))}
          </div>
          )}

          {!MODO_ENTRA && (
            <>
              <Button
                variant="secondary"
                disabled
                className="entrada mt-8 h-12 w-full justify-between px-4 text-muted-foreground"
                style={retraso(680)}
              >
                Continuar con Microsoft
                <span className="rounded bg-card px-2 py-0.5 text-[13px]">Próximamente</span>
              </Button>

              <p className="mt-6 text-center text-[13px] text-muted-foreground">
                Ambiente de pruebas. Los datos no son reales.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
