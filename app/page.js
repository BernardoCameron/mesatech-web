"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/components/sesion-provider";
import { PantallaCarga } from "@/components/pantalla-carga";

// Entrada: manda al login o a la pantalla principal segun el rol
export default function Inicio() {
  const router = useRouter();
  const { usuario, cargando } = useSesion();

  useEffect(() => {
    if (cargando) return;
    if (!usuario) router.replace("/login");
    else if (usuario.rol === "Cliente") router.replace("/mis-solicitudes");
    else router.replace("/solicitudes");
  }, [usuario, cargando, router]);

  return <PantallaCarga />;
}
