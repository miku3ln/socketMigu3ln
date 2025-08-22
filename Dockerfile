#BUILD LOCAL
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY /dist /usr/share/nginx/html
# ENV NODE_OPTIONS=--max_old_space_size=8000
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

#BUILD CON JENKINS
# ---------- Etapa de build (con devDependencies: TypeScript, etc) ----------
FROM node:20.19.4 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build  # genera dist/

# ---------- Etapa de runtime (solo prodDependencies) ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos el JS ya compilado
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
