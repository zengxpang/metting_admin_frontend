FROM node:18.0-alpine3.14
WORKDIR /app
COPY package.json ./
RUN npm config set registry registry.npmmirror.com
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
#启动Nginx
#CMD ["/usr/sbin/nginx","-g","daemon off;"]
