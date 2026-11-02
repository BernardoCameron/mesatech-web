import { ETIQUETA_ESTADO } from "@/lib/estados";

// Color de la fichita de cada estado (ver Eval2/diseno/DISENO.md)
const COLOR_ESTADO = {
  CREADA: "bg-[#9a93ad]",
  ASIGNADA: "bg-[#3b82f6]",
  EN_PROCESO: "bg-[#d97706]",
  RESUELTA: "bg-[#16a34a]",
  CERRADA: "bg-[#1e0f32]",
  CANCELADA: "bg-[#b91c1c]",
};

// Estado: una fichita plana (la misma forma que cruza el fondo del login) y el nombre en texto normal.
export function EstadoMarca({ estado }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm">
      <span className={`h-2 w-3.5 rounded-[2px] ${COLOR_ESTADO[estado] || COLOR_ESTADO.CREADA}`} />
      {ETIQUETA_ESTADO[estado] || estado}
    </span>
  );
}

const COLOR_PRIORIDAD = {
  Alta: "bg-[#b91c1c]",
  Media: "bg-[#d97706]",
  Baja: "bg-[#9a93ad]",
};

// Prioridad: punto redondo y texto
export function PrioridadPunto({ prioridad }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm">
      <span className={`size-2 rounded-full ${COLOR_PRIORIDAD[prioridad] || "bg-[#9a93ad]"}`} />
      {prioridad}
    </span>
  );
}
