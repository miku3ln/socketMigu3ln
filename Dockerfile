# ---------- Etapa de build (TypeScript -> JavaScript) ----------
# Por qué: aquí sí necesitamos devDependencies (typescript, etc.)
FROM node:20.19.4 AS builder
WORKDIR /app

# Instalar deps con lockfile (rápido y reproducible)
COPY package*.json ./
RUN npm ci

# Copiamos config TS + código fuente y construimos /dist
COPY tsconfig.json ./
COPY src ./src
RUN npm run build     # genera dist/


# ---------- Etapa de runtime (solo producción) ----------
# Por qué: imagen liviana, sin devDependencies
FROM node:20-alpine
WORKDIR /app

# Que la app escuche en todas las interfaces del contenedor
# y en el puerto 3000 (estándar interno del servicio)
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el build (JS compilado) desde la etapa anterior
COPY --from=builder /app/dist ./dist

# NO copiamos .env al contenedor
# (en Docker, configuramos por variables de entorno desde compose.yml)

# Exponemos 3000 dentro del contenedor (documentación)
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/index.js"]
