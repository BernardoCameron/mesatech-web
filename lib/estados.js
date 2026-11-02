export const ESTADOS = ["CREADA", "ASIGNADA", "EN_PROCESO", "RESUELTA", "CERRADA", "CANCELADA"];

export const ETIQUETA_ESTADO = {
  CREADA: "Creada",
  ASIGNADA: "Asignada",
  EN_PROCESO: "En proceso",
  RESUELTA: "Resuelta",
  CERRADA: "Cerrada",
  CANCELADA: "Cancelada",
};

export const PRIORIDADES = ["Baja", "Media", "Alta"];

export function formatoFecha(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "short" });
}

export function formatoFechaHora(iso) {
  if (!iso) return "";
  const fecha = new Date(iso);
  const dia = fecha.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
  const hora = fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  return `${dia}, ${hora}`;
}

export function idCorto(id) {
  return "#" + String(id).slice(0, 6);
}
