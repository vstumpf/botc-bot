FROM node:19-alpine

WORKDIR /app

RUN apk update

COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .

RUN yarn install

COPY prisma prisma
COPY src src

RUN yarn prisma generate
RUN yarn build
RUN yarn update-commands

CMD ["yarn", "serve"]
