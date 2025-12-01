# Base image - FROM [base_image]:[version]
FROM debian:12

# Install dependencies - RUN [install_command] [package1] [package2]
RUN apt-get update && apt-get install -y gettext-base mariadb-server && \
	apt-get clean && rm -rf /var/lib/apt/lists/* && mkdir -p /run/mysqld \
	&& chown -R mysql:mysql /run/mysqld

# Copy files from host into container - COPY [source_path] [destination_path]
# Copy the initialization script
COPY tools/start.sh /usr/local/bin/start.sh

# Run custom build steps - RUN [command]
# Make script executable
RUN chmod +x /usr/local/bin/start.sh

# Alternative entrypoint (sets main process, CMD is arguments)
ENTRYPOINT ["start.sh"]
