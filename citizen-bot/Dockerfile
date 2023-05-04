FROM python:3.8.10

WORKDIR /bot

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . .

RUN pip install wheel

RUN pip install -r requirements.txt