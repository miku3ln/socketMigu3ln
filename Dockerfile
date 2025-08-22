#BUILD LOCAL
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY /dist /usr/share/nginx/html
# ENV NODE_OPTIONS=--max_old_space_size=8000
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

#BUILD CON JENKINS
FROM node:20.19.4
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]