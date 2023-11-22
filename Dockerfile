# 阶段一：安装依赖和构建应用
FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

# 复制 package.json 和 pnpm 的锁文件到容器中
COPY package.json .

# 安装依赖
RUN npm install

# 复制应用程序的其他文件到容器中
COPY . .

# 构建应用
RUN npm run build

# 阶段二：运行应用
FROM node:18.0-alpine3.14 as production-stage

# 将阶段一构建的产物复制到新的镜像中
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/node_modules /app/node_modules

WORKDIR /app

# 还是有问题
RUN npm install -g serve

# 暴露应用所使用的端口
EXPOSE 3000

CMD ["npm", "run", "serve"]