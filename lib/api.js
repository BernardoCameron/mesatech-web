import { getUsuarioGuardado } from "@/lib/sesion";

// Todas las llamadas van al BFF (mas adelante, por API Gateway).
const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/v1`;

// En modo prueba el BFF (perfil sinauth) lee estos headers.
// Con Entra ID aqui se agregaria "Authorization: Bearer <token>".
export async function api(ruta, { metodo = "GET", cuerpo } = {}) {
  const usuario = getUsuarioGuardado();
  const headers = { "Content-Type": "application/json" };
  if (usuario) {
    headers["X-Test-Rol"] = usuario.rol;
    headers["X-Test-Usuario"] = usuario.id;
    headers["X-Test-Nombre"] = usuario.nombre;
  }

  const respuesta = await fetch(BASE + ruta, {
    method: metodo,
    headers,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });

  if (!respuesta.ok) {
    const error = new Error("Error " + respuesta.status);
    error.status = respuesta.status;
    // Los microservicios responden {"error": "mensaje"}
    try {
      error.mensaje = (await respuesta.json()).error;
    } catch {
      error.mensaje = null;
    }
    throw error;
  }
  return respuesta.json();
}
