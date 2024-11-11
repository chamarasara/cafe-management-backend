FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4000

ENV NODE_ENV=development


CMD ["yarn", "dev"]
