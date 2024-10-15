# 使用 Node.js alpine 版本作为基础镜像
FROM node:22.9-alpine3.19 AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:22.9-alpine3.19 AS runner

WORKDIR /app

ENV NODE_ENV production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 从构建阶段复制必要文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 设置正确的权限
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
