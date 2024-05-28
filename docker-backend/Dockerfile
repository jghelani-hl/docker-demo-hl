FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENV MONGO_URI=mongodb://demo-mongo:27017

CMD [ "npm", "start" ]