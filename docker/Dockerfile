FROM node:alpine as nodeBuilder

WORKDIR /app
COPY ./front ./
COPY ./config ./
# RUN npm config set registry https://registry.npm.taobao.org  && \
#     npm install
RUN npm install
RUN npm run build

FROM nginx:alpine as production-stage
# COPY --from=nodeBuilder /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=nodeBuilder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]