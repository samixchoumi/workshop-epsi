FROM node:10.13.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
CMD [ "npm", "start" ]