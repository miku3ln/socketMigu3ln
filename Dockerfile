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
RUN npm run build     # genera dist/

# --- Runtime solo prod ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY .env ./.env
EXPOSE 3000
CMD ["node", "dist/index.js"]