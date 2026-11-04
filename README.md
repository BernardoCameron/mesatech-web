# MesaTech Cloud: front

Front de MesaTech Cloud (EP2, DSY1107). Next.js (App Router), Tailwind y shadcn/ui. Se comunica solo con el BFF
(`mesatech-backend`) por HTTP.

## Requisitos

Node.js 22 y npm, o Docker. BFF disponible. Para el login real, la app `mesatech-frontend` en Microsoft Entra ID.

## Variables de entorno

Las variables `NEXT_PUBLIC_*` se fijan en el build; si cambian, hay que recompilar.

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL del BFF |
| `NEXT_PUBLIC_AUTH` | `prueba` (3 perfiles fijos, BFF con perfil `sinauth`) o `entra` (Microsoft Entra ID) |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | Tenant de Entra ID |
| `NEXT_PUBLIC_AZURE_WEB_CLIENT_ID` | Client ID de la app del front (SPA) |
| `NEXT_PUBLIC_API_SCOPE` | Scope de la API (`api://<client-id-api>/access_as_user`) |
| `NEXT_PUBLIC_REDIRECT_URI` | Redirect URI. Si se omite, el origen de la página |

## Ejecución local

```bash
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
docker compose up -d --build     # alternativa con Docker
```

## Despliegue en AWS (`ep2-web`)

`deploy/compose.yml` levanta tres contenedores en una EC2 Ubuntu 24.04 con IP elástica.

| Contenedor | Función | Puerto |
|---|---|---|
| `nginx` | Termina TLS con el Origin Certificate de Cloudflare y enruta por dominio | 443 |
| `web` | Front (Next.js, salida `standalone`) | 3000 interno |
| `bff` | BFF, construido desde `../../mesatech-backend/bff` | 8080 interno |

```bash
cd deploy
cp .env.example .env            # dominios, datos de Entra ID, IP privadas de los microservicios
# deploy/certs/origen.pem y deploy/certs/origen.key (no se versionan)
docker compose up -d --build
```

Requiere `mesatech-web` y `mesatech-backend` clonados en el mismo directorio.

| Elemento | Configuración |
|---|---|
| Cloudflare | Registros A de front y API hacia la IP elástica, con proxy; SSL/TLS Full (strict) |
| Security group | 443 solo desde los rangos de Cloudflare |
| Entra ID | Redirect URI del front en la app `mesatech-frontend` |

Si se recrea el contenedor `web`, reiniciar `nginx` (resuelve la dirección del contenedor al arrancar).

## Versión

Último commit de `main`.
