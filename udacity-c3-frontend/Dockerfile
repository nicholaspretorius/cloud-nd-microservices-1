FROM beevelop/ionic as builder

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["ionic", "build"]

FROM nginx:alpine

COPY --from=builder /usr/src/app/www /usr/share/nginx/html