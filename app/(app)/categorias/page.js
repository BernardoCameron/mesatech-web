"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function cargar() {
    api("/categorias")
      .then(setCategorias)
      .catch(() => setError("No se pudieron cargar las categorías."));
  }

  useEffect(cargar, []);

  async function crear(e) {
    e.preventDefault();
    setError(null);
    setAviso(null);
    setEnviando(true);
    try {
      await api("/categorias", { metodo: "POST", cuerpo: { nombre } });
      setAviso("Categoría creada.");
      setNombre("");
      cargar();
    } catch (err) {
      if (err.status === 409) setError("Esa categoría ya existe.");
      else if (err.status === 403) setError("No tienes permiso para crear categorías.");
      else setError("No se pudo crear la categoría. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1 className="text-[22px] font-medium tracking-tight">Categorías</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Categorías que se pueden elegir al crear una solicitud.
      </p>

      <form onSubmit={crear} className="mb-6 max-w-[560px] space-y-4 rounded-xl bg-card p-6">
        {error && (
          <div className="rounded-lg bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">{error}</div>
        )}
        {aviso && (
          <div className="rounded-lg bg-[#dcfce7] px-4 py-3 text-sm text-[#166534]">{aviso}</div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre de la categoría</Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            maxLength={60}
            placeholder="Ej: Impresoras"
            className="h-9 bg-card"
          />
        </div>

        <Button type="submit" variant="mint" size="lg" disabled={enviando}>
          {enviando ? "Creando..." : "Crear categoría"}
        </Button>
      </form>

      <div className="max-w-[560px] rounded-xl bg-card">
        {categorias.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Aún no hay categorías.</p>
        ) : (
          <ul className="divide-y divide-border">
            {categorias.map((c) => (
              <li key={c.categoriaId} className="px-6 py-3 text-sm">
                {c.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
