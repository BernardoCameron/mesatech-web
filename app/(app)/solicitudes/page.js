"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CampoSelect } from "@/components/campo-select";
import { ListaSolicitudes } from "@/components/lista-solicitudes";
import { api } from "@/lib/api";
import { ESTADOS, ETIQUETA_ESTADO, PRIORIDADES } from "@/lib/estados";

export default function TodasLasSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [filtroEstado, setFiltroEstado] = useState("TODAS");
  const [filtroPrioridad, setFiltroPrioridad] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    api("/solicitudes")
      .then(setSolicitudes)
      .catch(() => setError("No se pudieron cargar las solicitudes."))
      .finally(() => setCargando(false));
  }, []);

  // Totales de arriba, calculados con las solicitudes cargadas
  const totales = useMemo(() => {
    const cuenta = (...estados) => solicitudes.filter((s) => estados.includes(s.estado)).length;
    return [
      { etiqueta: "Total", valor: solicitudes.length },
      { etiqueta: "Abiertas", valor: cuenta("CREADA", "ASIGNADA") },
      { etiqueta: "En proceso", valor: cuenta("EN_PROCESO") },
      { etiqueta: "Resueltas", valor: cuenta("RESUELTA", "CERRADA") },
    ];
  }, [solicitudes]);

  const visibles = solicitudes.filter((s) => {
    if (filtroEstado !== "TODAS" && s.estado !== filtroEstado) return false;
    if (filtroPrioridad !== "TODAS" && s.prioridad !== filtroPrioridad) return false;
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return true;
    return (
      s.titulo.toLowerCase().includes(texto) || (s.usuarioNombre || "").toLowerCase().includes(texto)
    );
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight">Todas las solicitudes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona el estado y la atención de cada solicitud.
          </p>
        </div>
        <Link href="/nueva-solicitud" className={buttonVariants({ variant: "mint", size: "lg" })}>
          Nueva solicitud
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-xl bg-card lg:grid-cols-4">
        {totales.map((t) => (
          <div key={t.etiqueta} className="px-5 py-4">
            <div className="text-xs text-muted-foreground">{t.etiqueta}</div>
            <div className="mt-1 text-3xl font-medium tracking-tight">{t.valor}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por título o solicitante"
              className="h-9 bg-card pl-8"
            />
          </div>

          <CampoSelect
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="sm:ml-auto"
            aria-label="Filtrar por prioridad"
          >
            <option value="TODAS">Todas las prioridades</option>
            {PRIORIDADES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </CampoSelect>
        </div>

        {/* En celular los estados se deslizan de lado, sin saltar de linea */}
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
          {["TODAS", ...ESTADOS].map((e) => {
            const activo = filtroEstado === e;
            const cantidad =
              e === "TODAS" ? solicitudes.length : solicitudes.filter((s) => s.estado === e).length;
            return (
              <button
                key={e}
                onClick={() => setFiltroEstado(e)}
                className={`shrink-0 border-b-2 px-2.5 py-1.5 text-sm transition-colors ${
                  activo
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {e === "TODAS" ? "Todas" : ETIQUETA_ESTADO[e]} {cantidad}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
      )}

      <ListaSolicitudes
        solicitudes={visibles}
        cargando={cargando}
        conSolicitante
        textoVacio="No hay solicitudes con esos filtros."
      />
    </div>
  );
}
