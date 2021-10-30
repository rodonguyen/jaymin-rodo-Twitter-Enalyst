FROM node:14-alpine

WORKDIR /app

COPY server/package.json /app/server/package.json

RUN cd server && npm install && cd ..

COPY . .

WORKDIR server

CMD [ "npm", "start" ]
