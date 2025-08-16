IMG ?=  ghcr.io/kubebrowser/browser-server:0.0.2

docker-build:
	docker build -f Dockerfile.full --platform linux/arm64,linux/amd64 -t ${IMG} .

docker-push:
	docker push ${IMG}