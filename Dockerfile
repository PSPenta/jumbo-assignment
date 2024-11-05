FROM node:lts-alpine3.12

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install
RUN mkdir logs && chmod -R 777 logs

COPY /. /app/

EXPOSE 80
CMD ["node", "app.js"]
