FROM node:16-alpine

WORKDIR /app

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

# RUN apk add --update --no-cache \
#   make \
#   g++ \
#   jpeg-dev \
#   cairo-dev \
#   giflib-dev \
#   pango-dev \
#   libtool \
#   autoconf \
#   automake

COPY package.json ./
RUN npm install -g typescript
RUN npm install

COPY . .
EXPOSE 3003
CMD npm run local
