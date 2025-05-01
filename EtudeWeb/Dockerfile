FROM node:20-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["mkdir", "-p", "/etc/nginx/ssl"]

CMD ["openssl", "req", "-x509", "-nodes", "-days", "365", "-newkey", "rsa:2048", "-keyout", "/etc/nginx/ssl/selfsigned.key", "-out", "/etc/nginx/ssl/selfsigned.crt", "-subj","/CN=109.73.203.57"]

CMD ["nginx", "-g", "daemon off;"]