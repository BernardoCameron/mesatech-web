"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUsuarioGuardado, guardarUsuario, borrarUsuario } from "@/lib/sesion";
import { MODO_ENTRA, recuperarUsuario, iniciarLogin, cerrarSesion } from "@/lib/entra";

const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la pagina se recupera la sesion: Microsoft o usuario de prueba guardado
  useEffect(() => {
    if (MODO_ENTRA) {
      recuperarUsuario()
        .then(setUsuario)
        .catch(() => setUsuario(null))
        .finally(() => setCargando(false));
    } else {
      setUsuario(getUsuarioGuardado());
      setCargando(false);
    }
  }, []);

  function entrar(id) {
    guardarUsuario(id);
    setUsuario(getUsuarioGuardado());
  }

  function entrarConMicrosoft() {
    return iniciarLogin();
  }

  function salir() {
    if (MODO_ENTRA) {
      cerrarSesion();
      return;
    }
    borrarUsuario();
    setUsuario(null);
  }

  return (
    <SesionContext.Provider value={{ usuario, cargando, entrar, entrarConMicrosoft, salir }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SesionContext);
}
