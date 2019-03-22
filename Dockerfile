FROM node:8-slim

WORKDIR /starter
ENV NODE_ENV development

COPY package.json /starter/package.json

RUN npm install --production

COPY .env.dev.docker /starter/.env
COPY . /starter

CMD ["npm","start"]

EXPOSE 3000
