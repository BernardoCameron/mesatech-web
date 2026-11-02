# Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# La URL del BFF se "hornea" en el build (la usa el navegador)
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# Login con Microsoft Entra ID (si NEXT_PUBLIC_AUTH no es "entra", se usan los usuarios de prueba)
ARG NEXT_PUBLIC_AUTH=prueba
ARG NEXT_PUBLIC_AZURE_TENANT_ID=
ARG NEXT_PUBLIC_AZURE_WEB_CLIENT_ID=
ARG NEXT_PUBLIC_API_SCOPE=
ARG NEXT_PUBLIC_REDIRECT_URI=
ENV NEXT_PUBLIC_AUTH=$NEXT_PUBLIC_AUTH
ENV NEXT_PUBLIC_AZURE_TENANT_ID=$NEXT_PUBLIC_AZURE_TENANT_ID
ENV NEXT_PUBLIC_AZURE_WEB_CLIENT_ID=$NEXT_PUBLIC_AZURE_WEB_CLIENT_ID
ENV NEXT_PUBLIC_API_SCOPE=$NEXT_PUBLIC_API_SCOPE
ENV NEXT_PUBLIC_REDIRECT_URI=$NEXT_PUBLIC_REDIRECT_URI
RUN npm run build

# Run
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
