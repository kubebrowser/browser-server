IMG ?= quay.io/mohamedf0/browser-server:latest

docker-build:
	docker build -f Dockerfile.full -t ${IMG} .

docker-push:
	docker push ${IMG}