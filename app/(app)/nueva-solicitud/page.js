"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CampoSelect } from "@/components/campo-select";
import { api } from "@/lib/api";
import { PRIORIDADES } from "@/lib/estados";

export default function NuevaSolicitud() {
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridad, setPrioridad] = useState(PRIORIDADES[0]);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Las categorias vienen del catalogo (base de datos), no estan fijas en el codigo
  useEffect(() => {
    api("/categorias")
      .then((lista) => {
        setCategorias(lista);
        if (lista.length > 0) setCategoria(lista[0].nombre);
      })
      .catch(() => setError("No se pudieron cargar las categorías."));
  }, []);

  async function crear(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await api("/solicitudes", { metodo: "POST", cuerpo: { titulo, descripcion, categoria, prioridad } });
      router.push("/mis-solicitudes");
    } catch (err) {
      setError(
        err.status === 403
          ? "No tienes permiso para crear solicitudes."
          : "No se pudo crear la solicitud. Intenta nuevamente."
      );
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1 className="text-[22px] font-medium tracking-tight">Nueva solicitud</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Describe el problema y un operador la tomará desde la cola.
      </p>

      <form onSubmit={crear} className="max-w-[560px] space-y-5 rounded-xl border border-border bg-card p-6">
        {error && (
          <div className="rounded-lg bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            maxLength={120}
            placeholder="Ej: No puedo acceder al correo corporativo"
            className="h-9 bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={5}
            placeholder="Detalla el problema, cuándo ocurrió y qué intentaste"
            className="bg-card"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="categoria">Categoría</Label>
            <CampoSelect
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full"
            >
              {categorias.map((c) => (
                <option key={c.categoriaId} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </CampoSelect>
            {categorias.length === 0 && (
              <p className="text-xs text-muted-foreground">No hay categorías todavía.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prioridad">Prioridad</Label>
            <CampoSelect
              id="prioridad"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              className="w-full"
            >
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </CampoSelect>
          </div>
        </div>

        <Button type="submit" variant="mint" size="lg" disabled={enviando || !categoria}>
          {enviando ? "Creando..." : "Crear solicitud"}
        </Button>
      </form>
    </div>
  );
}
