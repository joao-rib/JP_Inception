# Base image - FROM [base_image]:[version]
FROM alpine:3.20

# Install dependencies - RUN [install_command] [package1] [package2] // WIP - Examinar mais
RUN apk update && apk add --no-cache php83 php83-fpm php83-cli php83-mysqli php83-xml php83-json php83-curl \
	php83-gd php83-zip php83-dom php83-mbstring php83-phar ca-certificates wget bash su-exec tar mariadb-client \
	&& wget -qO /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
	&& chmod +x /usr/local/bin/wp \
	&& mkdir -p /var/www/html /var/log/php83 \
	&& echo "memory_limit = 512M" >> /etc/php83/php.ini \
	&& sed -i 's|^listen = .*|listen = 0.0.0.0:9000|' /etc/php83/php-fpm.d/www.conf

# Set working directory of the container - WORKDIR /[path]
WORKDIR /var/www/html

# Copy files from host into container - COPY [source_path] [destination_path]
# WIP Rever nomes
COPY tools/start.sh /start.sh

# Run custom build steps - RUN [command]
# WIP Rever nomes
RUN chmod +x /start.sh

# Expose a port - EXPOSE [port_number]
EXPOSE 9000

# Default command (may be overridden by Docker Run) - CMD ["executable", "param1", "param2"]
CMD ["/start.sh"]

# WIP Boa pratica
# Alternative entrypoint (sets main process, CMD is arguments)
ENTRYPOINT ["executable", "param1"]
