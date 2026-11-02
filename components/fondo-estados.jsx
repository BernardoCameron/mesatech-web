// Fondo animado del login: cuatro carriles (los estados de una solicitud) y fichas
// planas que los cruzan de izquierda a derecha, como solicitudes avanzando.
const CARRILES = [
  { nombre: "Creada", fondo: "#52238a" },
  { nombre: "Asignada", fondo: "#451c7a" },
  { nombre: "En proceso", fondo: "#52238a" },
  { nombre: "Resuelta", fondo: "#451c7a" },
];

// top (%), largo (px), duracion (s), retraso negativo (s) para que ya vayan a mitad de camino
const FICHAS = [
  // Ninguna ficha pasa por la franja del titular (entre 28% y 56% de alto)
  { top: 9, ancho: 120, duracion: 34, retraso: -6, mint: false },
  { top: 17, ancho: 88, duracion: 27, retraso: -19, mint: false },
  { top: 24, ancho: 140, duracion: 38, retraso: -11, mint: false },
  { top: 60, ancho: 96, duracion: 30, retraso: -2, mint: true },
  { top: 67, ancho: 112, duracion: 36, retraso: -24, mint: false },
  { top: 75, ancho: 84, duracion: 25, retraso: -9, mint: false },
  { top: 83, ancho: 132, duracion: 40, retraso: -30, mint: false },
  { top: 90, ancho: 100, duracion: 32, retraso: -15, mint: false },
];

export function FondoEstados() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden [--recorrido:110vw] lg:[--recorrido:55vw]">
      <div className="absolute inset-0 grid grid-cols-4">
        {CARRILES.map((c) => (
          <div
            key={c.nombre}
            style={{ background: c.fondo }}
            className="flex items-end whitespace-nowrap pb-3 pl-5 pr-1 text-[13px] text-white/40"
          >
            {c.nombre}
          </div>
        ))}
      </div>

      {FICHAS.map((f, i) => (
        <span
          key={i}
          className={`ficha absolute left-0 h-6 rounded-[5px] ${f.mint ? "bg-mint/70" : "bg-white/15"}`}
          style={{
            top: `${f.top}%`,
            width: f.ancho,
            "--duracion": `${f.duracion}s`,
            "--retraso": `${f.retraso}s`,
          }}
        />
      ))}
    </div>
  );
}
