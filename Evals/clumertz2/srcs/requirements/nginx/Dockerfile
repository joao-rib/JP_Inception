# Base image - FROM [base_image]:[version]
FROM debian:12

# Install dependencies and/or run custom build steps - RUN [install_command] [package1] [package2]
# Nginx and OpenSSL
RUN apt-get update && apt-get install -y nginx openssl && \
	apt-get clean && rm -rf /var/lib/apt/lists/*
# SSL cert and key
RUN mkdir -p /etc/nginx/ssl/ && openssl req -x509 -nodes -days 365 -newkey \
	rsa:2048 -keyout /etc/nginx/ssl/cert.key -out /etc/nginx/ssl/cert.crt \
	-subj "/C=PT/ST=Porto/L=Porto/O=42/OU=Student/CN=joao-rib.42.fr"

# Default command (may be overridden by Docker Run) - CMD ["executable", "param1", "param2"]
CMD ["nginx", "-g", "daemon off;"]