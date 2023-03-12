# citizen-api

## Build

    go build cmd/main.go

## Run the app

    make run

    go run cmd/main.go

# REST API

The REST API to the example app is described below.

## Get list of Vices

### Request

`GET /api/v1/vices`

    curl 'http://127.0.0.1:8000/api/v1/vices'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    []

## Get list of Characters

### Request

`GET /api/v1/characters`

    curl 'http://127.0.0.1:8000/api/v1/characters'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    []


## Get list of Emotions

### Request

`GET /api/v1/emotions`

    curl 'http://127.0.0.1:8000/api/v1/emotions'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    []


## Get list of Moralitys

### Request

`GET /api/v1/moralitys`

    curl 'http://127.0.0.1:8000/api/v1/moralitys'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    []

## Get list of Attitudes

### Request

`GET /api/v1/attitudes`

    curl 'http://127.0.0.1:8000/api/v1/attitudes'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    []

## Get list of Skills

### Request

`GET /api/v1/skills`

    curl 'http://127.0.0.1:8000/api/v1/skills'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    []


## Get list of Emotions

### Request

`GET /api/v1/getNFT`

    curl 'http://80.87.110.190/api/v1/getNFT/{nft-address}'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    {"URI": ""}


## Deploy NFT Item

### Request

`POST /api/v1/deployNFT`

    curl --location --request GET 'http://127.0.0.1:8000/api/v1/deployNFT' \
    --header 'Content-Type: text/plain' \
    --data '{
        "address": "EQAf2_d83qovZQqTY--LW20NBONhzU-D7ItYdXC8td1k520r",
        "content": {
            "name": "Citizen",
            "description": "Citizen",
            "image": "https://arweave.net/9xf_L3YUKvg6e93EnXeOMQNF9kZt-ylh7hCVjSedG78?ext=png",
            "content_url": "https://arweave.net/tyOiQCVaa63urscZEtuZsE3L4zQfAkfzOowY7CsdDhs?ext=html",
            "attributes": []
        }
    }'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    ""


## Edit NFT content

### Request

`POST /api/v1/editNFT`

    curl --location --request GET 'http://127.0.0.1:8000/api/v1/editNFT' \
    --header 'Content-Type: text/plain' \
    --data '{
        "address": "EQAf2_d83qovZQqTY--LW20NBONhzU-D7ItYdXC8td1k520r",
        "content": {
            "name": "Citizen",
            "description": "Citizen",
            "image": "https://arweave.net/9xf_L3YUKvg6e93EnXeOMQNF9kZt-ylh7hCVjSedG78?ext=png",
            "content_url": "https://arweave.net/tyOiQCVaa63urscZEtuZsE3L4zQfAkfzOowY7CsdDhs?ext=html",
            "attributes": []
        }
    }'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    {"URI": ""}


# citizen-front
## Build
You need to do the following:
1. npm i
2. gulp


# citizen-bot
https://t.me/citizen_pasport_bot