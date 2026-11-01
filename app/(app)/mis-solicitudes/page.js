"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ListaSolicitudes } from "@/components/lista-solicitudes";
import { api } from "@/lib/api";

export default function MisSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/solicitudes/mias")
      .then(setSolicitudes)
      .catch(() => setError("No se pudieron cargar tus solicitudes."))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight">Mis solicitudes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Solicitudes creadas por ti y su estado actual.
          </p>
        </div>
        <Link href="/nueva-solicitud" className={buttonVariants({ variant: "mint", size: "lg" })}>
          Nueva solicitud
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
      )}

      <ListaSolicitudes
        solicitudes={solicitudes}
        cargando={cargando}
        textoVacio="Aún no tienes solicitudes."
      />
    </div>
  );
}
