"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CampoSelect } from "@/components/campo-select";
import { EstadoMarca, PrioridadPunto } from "@/components/estado-marca";
import { useSesion } from "@/components/sesion-provider";
import { api } from "@/lib/api";
import { ETIQUETA_ESTADO, SIGUIENTES, formatoFechaHora, idCorto } from "@/lib/estados";

export default function DetalleSolicitud() {
  const { id } = useParams();
  const { usuario } = useSesion();
  const esStaff = usuario.rol !== "Cliente";

  const [detalle, setDetalle] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);

  // Comentario nuevo
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorComentario, setErrorComentario] = useState(null);

  // Cambio de estado (solo Operador y Administrador)
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [notaEstado, setNotaEstado] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorEstado, setErrorEstado] = useState(null);

  function cargar() {
    return api(`/solicitudes/${id}`)
      .then(setDetalle)
      .catch((err) =>
        setErrorCarga(
          err.status === 403 ? "No tienes acceso a esta solicitud." : "No se pudo cargar la solicitud."
        )
      );
  }

  useEffect(() => {
    cargar();
  }, [id]);

  if (errorCarga) {
    return (
      <div>
        <VolverLink esStaff={esStaff} />
        <div className="rounded-lg bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">{errorCarga}</div>
      </div>
    );
  }
  if (!detalle) return <p className="text-sm text-muted-foreground">Cargando...</p>;

  const { solicitud, historial, comentarios } = detalle;
  const cerrada = solicitud.estado === "CERRADA" || solicitud.estado === "CANCELADA";
  const siguientes = SIGUIENTES[solicitud.estado] || [];
  const resolviendo = nuevoEstado === "RESUELTA";

  // Cambios de estado y comentarios en una sola linea de tiempo
  const actividad = [
    ...historial.map((h) => ({ tipo: "estado", clave: "h" + h.id, fecha: h.fecha, dato: h })),
    ...comentarios.map((c) => ({ tipo: "comentario", clave: "c" + c.id, fecha: c.fecha, dato: c })),
  ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  async function comentar(e) {
    e.preventDefault();
    setErrorComentario(null);
    setEnviando(true);
    try {
      await api(`/solicitudes/${id}/comentarios`, { metodo: "POST", cuerpo: { texto } });
      setTexto("");
      await cargar();
    } catch (err) {
      setErrorComentario(err.mensaje || "No se pudo enviar el comentario.");
    } finally {
      setEnviando(false);
    }
  }

  async function guardarEstado() {
    setErrorEstado(null);
    setGuardando(true);
    try {
      await api(`/solicitudes/${id}/estado`, {
        metodo: "PATCH",
        cuerpo: { estado: nuevoEstado, comentario: notaEstado.trim() || null },
      });
      setNuevoEstado("");
      setNotaEstado("");
      await cargar();
    } catch (err) {
      setErrorEstado(
        err.mensaje ||
          (err.status === 409
            ? "Esa solicitud no puede pasar a ese estado todavía."
            : "No se pudo actualizar el estado.")
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <VolverLink esStaff={esStaff} />

      <div className="mb-6">
        <div className="text-[13px] text-muted-foreground">{idCorto(solicitud.id)}</div>
        <h1 className="mt-0.5 text-[22px] font-medium leading-snug tracking-tight">{solicitud.titulo}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
          <EstadoMarca estado={solicitud.estado} />
          <PrioridadPunto prioridad={solicitud.prioridad} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <section className="rounded-xl bg-card p-5">
            <h2 className="mb-2 text-sm font-medium">Descripción</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{solicitud.descripcion}</p>
          </section>

          <section className="rounded-xl bg-card p-5">
            <h2 className="mb-4 text-sm font-medium">Actividad</h2>

            <ol className="space-y-5">
              {actividad.map((item) =>
                item.tipo === "estado" ? (
                  <li key={item.clave} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex flex-wrap items-center gap-x-2 text-muted-foreground">
                      {item.dato.estadoAnterior ? "Cambió a" : "Solicitud creada"}
                      {item.dato.estadoAnterior && <EstadoMarca estado={item.dato.estadoNuevo} />}
                    </span>
                    <span className="shrink-0 text-[13px] text-muted-foreground">
                      {formatoFechaHora(item.fecha)}
                    </span>
                  </li>
                ) : (
                  <li key={item.clave} className={item.dato.tipo === "SOLUCION" ? "rounded-lg bg-secondary p-4" : ""}>
                    {item.dato.tipo === "SOLUCION" && (
                      <div className="mb-1.5 text-[13px] font-medium text-primary">Solución</div>
                    )}
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm">
                        <span className="font-medium">{item.dato.autorNombre}</span>{" "}
                        <span className="text-muted-foreground">· {item.dato.rol}</span>
                      </span>
                      <span className="shrink-0 text-[13px] text-muted-foreground">
                        {formatoFechaHora(item.fecha)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{item.dato.texto}</p>
                  </li>
                )
              )}
            </ol>

            {cerrada ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Esta solicitud está {ETIQUETA_ESTADO[solicitud.estado].toLowerCase()} y ya no admite
                comentarios.
              </p>
            ) : (
              <form onSubmit={comentar} className="mt-6 space-y-3">
                <Label htmlFor="comentario">Agregar un comentario</Label>
                <Textarea
                  id="comentario"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder="Escribe una actualización para esta solicitud"
                  className="bg-card"
                />
                {errorComentario && <p className="text-sm text-[#b91c1c]">{errorComentario}</p>}
                <Button type="submit" size="lg" disabled={enviando || !texto.trim()}>
                  {enviando ? "Enviando..." : "Comentar"}
                </Button>
              </form>
            )}
          </section>
        </div>

        <div className="space-y-5">
          {esStaff && (
            <section className="rounded-xl bg-card p-5">
              <h2 className="mb-3 text-sm font-medium">Cambiar estado</h2>

              {siguientes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay más cambios posibles.</p>
              ) : (
                <div className="space-y-3">
                  <CampoSelect
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    className="w-full"
                    aria-label="Nuevo estado"
                  >
                    <option value="">Elegir estado</option>
                    {siguientes.map((e) => (
                      <option key={e} value={e}>
                        {ETIQUETA_ESTADO[e]}
                      </option>
                    ))}
                  </CampoSelect>

                  {nuevoEstado && (
                    <div className="space-y-1.5">
                      <Label htmlFor="nota">
                        {resolviendo ? "¿Cómo se solucionó?" : "Comentario (opcional)"}
                      </Label>
                      <Textarea
                        id="nota"
                        value={notaEstado}
                        onChange={(e) => setNotaEstado(e.target.value)}
                        rows={3}
                        maxLength={2000}
                        placeholder={
                          resolviendo
                            ? "Describe qué se hizo para resolverla"
                            : "Deja una nota sobre este cambio"
                        }
                        className="bg-card"
                      />
                    </div>
                  )}

                  {errorEstado && <p className="text-sm text-[#b91c1c]">{errorEstado}</p>}

                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-secondary"
                    disabled={guardando || !nuevoEstado || (resolviendo && !notaEstado.trim())}
                    onClick={guardarEstado}
                  >
                    {guardando ? "Guardando..." : "Guardar cambio"}
                  </Button>
                </div>
              )}
            </section>
          )}

          <section className="rounded-xl bg-card p-5">
            <h2 className="mb-3 text-sm font-medium">Datos</h2>
            <dl className="space-y-3 text-sm">
              <Dato nombre="Solicitante" valor={solicitud.usuarioNombre} />
              <Dato nombre="Categoría" valor={solicitud.categoria} />
              <Dato nombre="Creada" valor={formatoFechaHora(solicitud.fechaCreacion)} />
              <Dato nombre="Última actualización" valor={formatoFechaHora(solicitud.fechaActualizacion)} />
              <Dato nombre="Asignada" valor={formatoFechaHora(solicitud.fechaAsignacion)} />
              <Dato nombre="Resuelta" valor={formatoFechaHora(solicitud.fechaResolucion)} />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

function VolverLink({ esStaff }) {
  return (
    <Link
      href={esStaff ? "/solicitudes" : "/mis-solicitudes"}
      className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      Volver
    </Link>
  );
}

function Dato({ nombre, valor }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{nombre}</dt>
      <dd className="text-right">{valor || "—"}</dd>
    </div>
  );
}
