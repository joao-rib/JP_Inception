FROM nginx:1.27-alpine

RUN apk add --no-cache openssl

COPY default.conf /etc/nginx/conf.d/default.conf
COPY generate-cert.sh /docker-entrypoint.d/10-generate-cert.sh
RUN chmod +x /docker-entrypoint.d/10-generate-cert.sh

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

