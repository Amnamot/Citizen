# citizen-api

## The project uses cli bundlr

### Install

    sudo npm i -g @bundlr-network/client

## Build

    go build cmd/main.go

## Run the app

    make run

    go run cmd/main.go

# REST API

The REST API to the example app is described below.

## Get list of data

### Request

`GET /api/v1/data`

    curl 'http://127.0.0.1:8000/api/v1/data'

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    {"vices": [], "characters": [], "moralitys": [], "emotions": [], "skills": []}



## Get NFT data

### Request

`GET /api/v1/getNFT`

    curl 'http://80.87.110.190/api/v1/getNFT/{telegram-id}'

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
        "id": telegram-id
        "address": "owner",
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
        "address": "NFT address",
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


## Send message telegram

### Request

`POST /api/v1/sendMessage`

    curl --location 'http://127.0.0.1:8000/api/v1/sendMessage' \
    --header 'Content-Type: text/plain' \
    --data '{
        "chat_id": "977794713",
        "text": "3423423"
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

## Send message telegram

### Request

`GET /api/v1/isuser/{username}`

    curl 'http://127.0.0.1:8000/api/v1/isuser/{username}'
    

### Response
    HTTP/1.1 200 OK
    Server: nginx/1.18.0 (Ubuntu)
    Date: Sun, 12 Mar 2023 11:08:01 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Content-Encoding: gzip

    {"telegram_id": ,"ispassport": }