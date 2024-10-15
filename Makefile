# 定义变量
IMAGE_NAME = tinywell/iching:nextjs
CONTAINER_NAME = i-ching-container

# 构建 Docker 镜像
build:
	docker build -t $(IMAGE_NAME) .

# 运行 Docker 容器
run:
	docker run -d -p 3000:3000 --name $(CONTAINER_NAME) $(IMAGE_NAME)

# 停止并删除 Docker 容器
stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

# 清理 Docker 镜像
clean:
	docker rmi $(IMAGE_NAME)

# 构建并运行
up: build run

# 停止并清理
down: stop clean

# 使用 docker-compose 构建和运行
compose-up:
	docker-compose up -d --build

# 停止并删除 docker-compose 容器
compose-down:
	docker-compose down

# 查看日志
logs:
	docker logs -f $(CONTAINER_NAME)
