# MesaTech Cloud: front

Front de MesaTech Cloud (EP2, DSY1107). Next.js (App Router), Tailwind y shadcn/ui. Habla solo con el BFF
(repo `mesatech-backend`) por HTTP.

## Correr en local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Con `NEXT_PUBLIC_AUTH=prueba` el login muestra 3 perfiles fijos (Administrador, Operador y Cliente) y el
BFF debe correr con el perfil `sinauth`. Con `NEXT_PUBLIC_AUTH=entra` el login usa Microsoft Entra ID y
manda el token al BFF; ahi hay que completar las variables `NEXT_PUBLIC_AZURE_*` del `.env.example`.

Las variables `NEXT_PUBLIC_*` se fijan al compilar: si las cambias, vuelve a hacer el build.

## Docker en local

```bash
docker compose up -d --build
```

Queda en http://localhost:3000 y espera el BFF en http://localhost:8080.

## Despliegue en EC2 (EP2)

La EC2 `ep2-web` corre nginx (443), el front y el BFF. Esta todo en `deploy/`:

1. Clonar `mesatech-web` y `mesatech-backend` lado a lado en la EC2.
2. Poner el Origin Certificate de Cloudflare en `deploy/certs/` como `origen.pem` y `origen.key`.
3. `cd deploy`, copiar `.env.example` a `.env` y completar los datos de Entra ID.
4. `docker compose up -d --build`

Cloudflare apunta `mesatech` y `mesatech-api` a la IP elastica de la EC2, con SSL Full (strict).
