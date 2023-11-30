FROM node:18.0-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --registry=https://registry.npmmirror.com
COPY . .
RUN npm run build
ENV NODE_ENV production

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# 启动Nginx
CMD ["/usr/sbin/nginx","-g","daemon off;"]
