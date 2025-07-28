IMG ?= quay.io/mohamedf0/browser-server:latest

docker-build:
	docker build -f Dockerfile.full --platform linux/arm64,linux/amd64 -t ${IMG} .

docker-push:
	docker push ${IMG}