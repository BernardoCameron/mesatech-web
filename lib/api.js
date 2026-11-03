import { getUsuarioGuardado } from "@/lib/sesion";
import { MODO_ENTRA, getToken } from "@/lib/entra";

// Todas las llamadas van al BFF (mas adelante, por API Gateway).
const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/v1`;

// En modo prueba el BFF (perfil sinauth) lee estos headers.
// Con Entra ID se manda el token de Microsoft en "Authorization".
export async function api(ruta, { metodo = "GET", cuerpo } = {}) {
  const headers = { "Content-Type": "application/json" };
  const usuario = MODO_ENTRA ? null : getUsuarioGuardado();
  if (MODO_ENTRA) {
    headers["Authorization"] = "Bearer " + (await getToken());
  } else if (usuario) {
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
