# Base image - FROM [base_image]:[version]
FROM alpine:3.20

# Install dependencies and/or run custom build steps - RUN [install_command] [package1] [package2]
RUN apk update && apk add --no-cache nginx openssl \
	&& mkdir -p /etc/nginx/ssl /run/nginx /var/log/nginx \
	&& openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt -subj \
    "/C=PT/ST=Porto/L=Porto/O=42/OU=Student/CN=joao-rib.42.fr"

# Copy files from host into container - COPY [source_path] [destination_path]
# WIP Rever nomes
COPY conf/default.conf /etc/nginx/http.d/default.conf

# Expose a port - EXPOSE [port_number]
EXPOSE 443

# Default command - CMD ["executable", "param1", "param2"]
CMD ["nginx", "-g", "daemon off;"]