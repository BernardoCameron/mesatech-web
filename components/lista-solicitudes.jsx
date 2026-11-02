"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EstadoMarca, PrioridadPunto } from "@/components/estado-marca";
import { formatoFecha, idCorto } from "@/lib/estados";

// Lista de solicitudes: tabla en pantallas grandes y tarjetas en celular.
// Al tocar una solicitud se abre su detalle.
export function ListaSolicitudes({ solicitudes, cargando, conSolicitante = false, textoVacio }) {
  const router = useRouter();

  function abrir(id) {
    router.push(`/solicitudes/${id}`);
  }

  if (!cargando && solicitudes.length === 0) {
    return (
      <div className="rounded-xl bg-card p-6 text-center text-sm text-muted-foreground">
        {textoVacio}
      </div>
    );
  }

  if (cargando) {
    return <div className="rounded-xl bg-card p-6 text-center text-sm text-muted-foreground">Cargando...</div>;
  }

  return (
    <>
      <ul className="space-y-2 md:hidden">
        {solicitudes.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => abrir(s.id)}
              className="w-full rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-medium leading-snug">{s.titulo}</span>
                <span className="shrink-0 text-[13px] text-muted-foreground">{formatoFecha(s.fechaCreacion)}</span>
              </div>
              <div className="mt-1 text-[13px] text-muted-foreground">
                {idCorto(s.id)} · {s.categoria}
                {conSolicitante ? ` · ${s.usuarioNombre}` : ""}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <EstadoMarca estado={s.estado} />
                <PrioridadPunto prioridad={s.prioridad} />
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="hidden rounded-xl bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">ID</TableHead>
              <TableHead>Título</TableHead>
              {conSolicitante && <TableHead>Solicitante</TableHead>}
              <TableHead>Categoría</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="pr-4 text-right">Creada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitudes.map((s) => (
              <TableRow key={s.id} onClick={() => abrir(s.id)} className="h-11 cursor-pointer">
                <TableCell className="pl-4 text-muted-foreground">{idCorto(s.id)}</TableCell>
                <TableCell className="max-w-[280px] truncate font-medium">{s.titulo}</TableCell>
                {conSolicitante && <TableCell>{s.usuarioNombre}</TableCell>}
                <TableCell>{s.categoria}</TableCell>
                <TableCell>
                  <PrioridadPunto prioridad={s.prioridad} />
                </TableCell>
                <TableCell>
                  <EstadoMarca estado={s.estado} />
                </TableCell>
                <TableCell className="pr-4 text-right text-muted-foreground">
                  {formatoFecha(s.fechaCreacion)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
