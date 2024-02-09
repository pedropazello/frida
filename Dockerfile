FROM node:21.6.1

RUN mkdir /myapp
WORKDIR /myapp

COPY . /myapp