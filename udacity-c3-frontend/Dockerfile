FROM node:12

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "start"]