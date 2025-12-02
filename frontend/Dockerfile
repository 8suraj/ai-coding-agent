FROM --platform=linux/amd64 node:lts-alpine3.18 as builder

WORKDIR /app


RUN apk update && apk add --no-cache git



COPY . .

RUN chmod +x chartinglibrary_files.prod.sh

RUN ./chartinglibrary_files.prod.sh

COPY package.json /app

RUN npm install 

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
