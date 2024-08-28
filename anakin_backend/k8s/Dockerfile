FROM node:16-alpine

WORKDIR /app

RUN apk add --update --no-cache \
  make \
  g++ \
  jpeg-dev \
  cairo-dev \
  giflib-dev \
  pango-dev \
  libtool \
  autoconf \
  automake

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3000
CMD npm run start
