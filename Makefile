.PHONY: front
front:
	cd ./front && npm run build

.PHONY: docker
docker:
	docker build -f ./docker/Dockerfile -t tinywell/iching .
	