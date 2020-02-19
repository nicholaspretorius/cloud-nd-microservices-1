FROM node:13.6.0-alpine 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev"]