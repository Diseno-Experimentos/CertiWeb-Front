FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --force
COPY . ./

# Build args to allow setting API base path at build-time
ARG VITE_SERVER_BASE_PATH=https://certiweb-backend.onrender.com/api/v1
ENV VITE_SERVER_BASE_PATH=${VITE_SERVER_BASE_PATH}

RUN npm run build

# Production image with nginx
FROM nginx:stable-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
