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
  const [reenviando, setReenviando] = useState(null);

  function cargar() {
    api("/categorias")
      .then(setCategorias)
      .catch(() => setError("No se pudieron cargar las categorías."));
  }

  // La categoria llega a Solicitudes de forma asincrona: se vuelve a consultar cada 3 segundos
  useEffect(() => {
    cargar();
    const reloj = setInterval(cargar, 3000);
    return () => clearInterval(reloj);
  }, []);

  async function crear(e) {
    e.preventDefault();
    setError(null);
    setAviso(null);
    setEnviando(true);
    try {
      await api("/categorias", { metodo: "POST", cuerpo: { nombre } });
      setAviso("Categoría creada. Quedará disponible cuando Solicitudes la reciba.");
      setNombre("");
    } catch (err) {
      if (err.status === 409) setError("Esa categoría ya existe.");
      else if (err.status === 403) setError("No tienes permiso para crear categorías.");
      else if (err.status === 502)
        setError("La categoría se guardó, pero no se pudo publicar el evento. Revisa RabbitMQ y usa Reenviar.");
      else setError("No se pudo crear la categoría. Intenta nuevamente.");
    } finally {
      setEnviando(false);
      cargar();
    }
  }

  async function reenviar(id) {
    setError(null);
    setAviso(null);
    setReenviando(id);
    try {
      await api(`/categorias/${id}/republicar`, { metodo: "POST" });
      setAviso("Evento reenviado.");
    } catch (err) {
      setError(
        err.status === 502
          ? "No se pudo publicar el evento. Revisa que RabbitMQ esté funcionando."
          : "No se pudo reenviar la categoría."
      );
    } finally {
      setReenviando(null);
      cargar();
    }
  }

  return (
    <div>
      <h1 className="text-[22px] font-medium tracking-tight">Categorías</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Una categoría nueva queda pendiente hasta que Solicitudes la recibe; recién ahí se puede usar.
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
          <ul>
            {categorias.map((c) => (
              <li key={c.categoriaId} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                <span>{c.nombre}</span>
                <span className="flex items-center gap-4">
                  {!c.disponible && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      disabled={reenviando === c.categoriaId}
                      onClick={() => reenviar(c.categoriaId)}
                    >
                      {reenviando === c.categoriaId ? "Reenviando..." : "Reenviar"}
                    </Button>
                  )}
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span
                      className={`h-2 w-3.5 rounded-[2px] ${c.disponible ? "bg-[#16a34a]" : "bg-[#d97706]"}`}
                    />
                    {c.disponible ? "Disponible" : "Pendiente"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
