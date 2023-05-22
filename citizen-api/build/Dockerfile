FROM golang:1.20-alpine as builder
WORKDIR /build
COPY ./go.mod .
RUN go get -d -v -u ./... && \
    go install -v ./...
COPY . .
RUN mkdir result && \
    go build -o ./result ./cmd

FROM alpine:3 as deploy
COPY --from=builder build/result /bin/citizen
ENTRYPOINT ["/bin/citizen/cmd"]