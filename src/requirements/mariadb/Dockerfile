# Base image - FROM [base_image]:[version]
FROM alpine:3.20

# Install dependencies - RUN [install_command] [package1] [package2] // TODO - Examinar mais
RUN apk update && apk add --no-cache mariadb mariadb-client su-exec \
	&& mkdir -p /var/lib/mysql /var/run/mysqld \
	&& chown -R mysql:mysql /var/lib/mysql /var/run/mysqld \
	&& sed -i 's/^skip-networking/bind-address=0.0.0.0/' /etc/my.cnf.d/mariadb-server.cnf

# Copy files from host into container - COPY [source_path] [destination_path]
# TODO Rever nomes
COPY tools/start.sh /start.sh

# Run custom build steps - RUN [command]
# TODO Rever nomes
RUN chmod +x /start.sh

# Expose a port - EXPOSE [port_number]
EXPOSE 3306

# Default command (may be overridden by Docker Run) - CMD ["executable", "param1", "param2"]
CMD ["/start.sh"]

# TODO Boa pratica
# Alternative entrypoint (sets main process, CMD is arguments)
ENTRYPOINT ["executable", "param1"]
