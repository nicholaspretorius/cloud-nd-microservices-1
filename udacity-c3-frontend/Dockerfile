FROM node:13.6.0-alpine 

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "start"]