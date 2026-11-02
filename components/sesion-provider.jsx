"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUsuarioGuardado, guardarUsuario, borrarUsuario } from "@/lib/sesion";

const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la pagina se lee el usuario guardado en el navegador
  useEffect(() => {
    setUsuario(getUsuarioGuardado());
    setCargando(false);
  }, []);

  function entrar(id) {
    guardarUsuario(id);
    setUsuario(getUsuarioGuardado());
  }

  function salir() {
    borrarUsuario();
    setUsuario(null);
  }

  return (
    <SesionContext.Provider value={{ usuario, cargando, entrar, salir }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SesionContext);
}
