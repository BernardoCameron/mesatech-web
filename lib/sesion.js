// Sesion de prueba: 3 usuarios fijos, sin Microsoft Entra ID.
// Cuando se vuelva a activar Azure, este archivo se reemplaza por el login con MSAL.
export const USUARIOS_PRUEBA = [
  {
    id: "admin.prueba",
    nombre: "Admin Prueba",
    rol: "Administrador",
    descripcion: "Gestiona categorías y ve todas las solicitudes",
  },
  {
    id: "operador.prueba",
    nombre: "Operador Prueba",
    rol: "Operador",
    descripcion: "Atiende solicitudes y cambia su estado",
  },
  {
    id: "cliente.prueba",
    nombre: "Cliente Prueba",
    rol: "Cliente",
    descripcion: "Crea solicitudes y sigue su estado",
  },
];

const CLAVE = "mesatech_usuario";

export function getUsuarioGuardado() {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(CLAVE);
  return USUARIOS_PRUEBA.find((u) => u.id === id) || null;
}

export function guardarUsuario(id) {
  window.localStorage.setItem(CLAVE, id);
}

export function borrarUsuario() {
  window.localStorage.removeItem(CLAVE);
}
