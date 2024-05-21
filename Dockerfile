FROM node:20.6-slim

WORKDIR /app

COPY . .

RUN npm run build:cd

ENV NODE_ENV=production

CMD npm start