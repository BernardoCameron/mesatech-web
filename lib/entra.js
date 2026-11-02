import { PublicClientApplication } from "@azure/msal-browser";

// NEXT_PUBLIC_AUTH=entra activa el login con Microsoft; si no, se usan los usuarios de prueba
export const MODO_ENTRA = process.env.NEXT_PUBLIC_AUTH === "entra";

const ALCANCE = [process.env.NEXT_PUBLIC_API_SCOPE];

// Del mas alto al mas bajo: si el usuario tiene varios roles se usa el primero que coincida
const ROLES = ["Administrador", "Operador", "Cliente"];

let msal = null;

async function getMsal() {
  if (!msal) {
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || window.location.origin;
    msal = new PublicClientApplication({
      auth: {
        clientId: process.env.NEXT_PUBLIC_AZURE_WEB_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
        redirectUri,
        postLogoutRedirectUri: redirectUri,
        // La sesion se procesa en la pagina de retorno (/), sin volver a /login
        navigateToLoginRequestUrl: false,
      },
      cache: { cacheLocation: "sessionStorage" },
    });
    await msal.initialize();
  }
  return msal;
}

// Los roles solo viajan en el access token de la API (no en el ID token)
function decodificar(token) {
  const cuerpo = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const texto = decodeURIComponent(
    atob(cuerpo)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(texto);
}

function usuarioDesdeToken(token) {
  const datos = decodificar(token);
  const roles = datos.roles || [];
  const rol = ROLES.find((r) => roles.includes(r));
  if (!rol) return null;
  return { id: datos.oid, nombre: datos.name || datos.preferred_username, rol };
}

// Token de acceso para el BFF; si la sesion de Microsoft vencio, vuelve a pedir el login
export async function getToken() {
  const app = await getMsal();
  const cuenta = app.getAllAccounts()[0];
  if (!cuenta) return null;
  try {
    const resultado = await app.acquireTokenSilent({ scopes: ALCANCE, account: cuenta });
    return resultado.accessToken;
  } catch {
    await app.acquireTokenRedirect({ scopes: ALCANCE, account: cuenta });
    return null;
  }
}

// Al abrir la pagina: termina el login si venimos de Microsoft y devuelve el usuario (o null si no hay sesion)
export async function recuperarUsuario() {
  const app = await getMsal();
  const respuesta = await app.handleRedirectPromise();
  const cuenta = respuesta?.account || app.getAllAccounts()[0];
  if (!cuenta) return null;

  const token = respuesta?.accessToken || (await getToken());
  if (!token) throw new Error("Microsoft no entregó un token de acceso.");

  const usuario = usuarioDesdeToken(token);
  if (!usuario) {
    throw new Error("Tu usuario no tiene un rol asignado en mesatech-api (Cliente, Operador o Administrador).");
  }
  return usuario;
}

export async function iniciarLogin() {
  const app = await getMsal();
  await app.loginRedirect({ scopes: ALCANCE });
}

export async function cerrarSesion() {
  const app = await getMsal();
  await app.logoutRedirect({ account: app.getAllAccounts()[0] });
}
