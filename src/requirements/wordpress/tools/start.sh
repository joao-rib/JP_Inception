#Language: !/bin/bash

# If any command returns non-zero (error), then exit
set -e

# Read passwords from Docker secrets
# WIP Confirmar nomes
WP_ADMIN_PASS="$(cat /run/secrets/wpadmin)"
WP_DB_PASS="$(cat /run/secrets/dbpass)"
WP_USER_PASS="$(cat /run/secrets/wpuser)"

# Waiting for MariaDB to be ready
# WIP (Alpine) ready // until mysqladmin ping -h"$WP_DB_HOST" -u"$WP_DB_USER" -p"$WP_DB_PASS" --silent; do
# WIP (Debian) ready and accessible // until wp db check --path=/var/www/html --allow-root; do
echo "Waiting for MariaDB to be ready..." # WIP Mensagem debug
until mysqladmin ping -h"$WP_DB_HOST" -u"$WP_DB_USER" -p"$WP_DB_PASS" --silent; do
	sleep 2
done
echo "MariaDB is ready!" # WIP Mensagem debug

# If WordPress not yet installed, do core install & create user
# WIP Confirmar nomes
if [ ! -f wp-config.php ]; then
	echo "Downloading & Installing WordPress..."

	wp core download --allow-root

	wp config create --allow-root \
		--dbname="$WP_DB_NAME" \
		--dbuser="$WP_DB_USER" \
		--dbpass="$WP_DB_PASS" \
		--dbhost="$WP_DB_HOST" \
		--skip-check

	wp core install --allow-root \
		--url="https://$DOMAIN_NAME" \
		--title="$WP_TITLE" \
		--admin_user="$WP_ADMIN_USER" \
		--admin_password="$WP_ADMIN_PASS" \
		--admin_email="$WP_ADMIN_EMAIL"

	wp user create --allow-root \
		"$WP_USER" "$WP_EMAIL" \
		--user_pass="$WP_USER_PASS"

    # WIP Considerar seguintes comandos // Ensures WordPress’ internal URLs match the container’s environment
    #wp option update siteurl "${WP_URL}" --path=/var/www/html --allow-root
    #wp option update home    "${WP_URL}" --path=/var/www/html --allow-root

	echo "WordPress installed!"
else
	echo "WordPress is already installed."
fi

# PHP-FPM version 8.3 (foreground)
exec php-fpm83 -F