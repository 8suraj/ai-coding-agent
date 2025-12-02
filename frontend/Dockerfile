FROM node:lts-alpine3.18 AS builder

WORKDIR /app

RUN apk update && apk add --no-cache git

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
