run:
	./main

.PHONY: runv2 # stop docker, remove old image and container, build new image, run it.
runv2:
	docker stop go_citizen || true && \
	docker rm go_citizen || true && \
	docker rmi go_citizen_image || true && \
	docker build -t go_citizen_image -f build/Dockerfile . && \
	docker run --env-file build/.env -p 8000:8000 -d --name go_citizen go_citizen_image