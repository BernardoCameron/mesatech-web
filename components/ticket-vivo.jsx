"use client";

import { useEffect, useState } from "react";

// Fragmento del producto funcionando: una solicitud que avanza sola por sus estados.
const PASOS = [
  { nombre: "Creada", hora: "09:12", responsable: "Sin asignar" },
  { nombre: "Asignada", hora: "09:15", responsable: "Camila Morales" },
  { nombre: "En proceso", hora: "09:31", responsable: "Camila Morales" },
  { nombre: "Resuelta", hora: "10:02", responsable: "Camila Morales" },
];

export function TicketVivo() {
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido) {
      setPaso(PASOS.length - 1);
      return;
    }
    const reloj = setInterval(() => setPaso((p) => (p + 1) % PASOS.length), 2800);
    return () => clearInterval(reloj);
  }, []);

  return (
    <div data-ui className="w-full max-w-[460px] rounded-xl bg-brand-dark p-4 text-white sm:p-5">
      <div className="text-[15px] font-medium">Impresora del piso 2 sin conexión</div>
      <div className="mt-0.5 text-[13px] text-white/60">Felipe Valenzuela · Finanzas</div>

      {/* En celular los pasos van en vertical; desde sm, en cuatro columnas */}
      <ol className="mt-4 flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:gap-2">
        {PASOS.map((p, i) => {
          const llego = i <= paso;
          const actual = i === paso;
          return (
            <li key={p.nombre} className="flex items-center gap-3 sm:block">
              <div
                className={`h-1.5 w-10 shrink-0 rounded-full transition-colors duration-500 sm:w-full ${
                  llego ? "bg-mint" : "bg-white/15"
                }`}
              />
              <div className="flex flex-1 items-baseline justify-between gap-2 sm:mt-2 sm:block">
                <span
                  className={`text-[13px] transition-colors duration-500 ${
                    actual ? "font-medium text-white" : llego ? "text-white/70" : "text-white/35"
                  }`}
                >
                  {p.nombre}
                </span>
                <span className="text-[13px] text-white/50 sm:block">{llego ? p.hora : "—"}</span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 text-[13px] text-white/60">
        Responsable: <span className="text-white">{PASOS[paso].responsable}</span>
      </div>
    </div>
  );
}
