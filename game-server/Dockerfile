FROM oven/bun as build

FROM node:16

COPY --from=build /usr/local/bin/bun /usr/local/bin
COPY --from=build /usr/local/bin/bunx /usr/local/bin


WORKDIR /app
COPY . .

RUN bun install uNetworking/uWebSockets.js#v20.31.0
RUN npm install
RUN npm run build

EXPOSE 9001
CMD npm run start


# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - 
# RUN apt-get install -y nodejs


# RUN apt-get update && apt-get install -y \
#   software-properties-common \
#   npm

# RUN npm install npm@16.20.0
# RUN npm install npm@16.20.0 -g && \
#   npm install n -g && \
#   n latest

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

# RUN apk add --no-cache \
#   bash \
#   curl


# ENV PYTHONUNBUFFERED=1
# RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN python3 -m ensurepip
# RUN pip3 install --no-cache --upgrade pip setuptools

# RUN curl -fsSL https://bun.sh/install | bash
# RUN export BUN_INSTALL="$HOME/.bun" 
# RUN export PATH="$BUN_INSTALL/bin:$PATH"

# RUN npm install
# RUN bun install uNetworking/uWebSockets.js#v20.31.0
# RUN npx tsc --version
# RUN npm run build

# EXPOSE 3000
# CMD npm run start


# CMD ["sleep","5600"]
