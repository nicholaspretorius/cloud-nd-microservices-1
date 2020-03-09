FROM beevelop/ionic as builder

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci

COPY . .
COPY ./nginx.conf /nginx.conf

# CMD ["ionic", "build"]
RUN echo "ionic build..."
RUN ionic build

FROM nginx:alpine

RUN echo "nginx..."

COPY --from=builder /usr/src/app/www /usr/share/nginx/html
COPY --from=builder /nginx.conf /etc/nginx/conf.d/default.conf