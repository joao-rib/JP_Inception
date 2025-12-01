#!/bin/bash

# If any command returns non-zero (error), then exit
set -e

# Read passwords from Docker secrets
WP_ADMIN_PASS=$(cat /run/secrets/admin_password)
#WP_DB_PASS=$(cat /run/secrets/db_password) # TODO confirmar
WP_USER_PASS=$(cat /run/secrets/user_password)
WP_URL="https://${DOMAIN_NAME}"

# Waiting for MariaDB to be ready
echo "Waiting for MariaDB to be ready..."
until wp db check --path=/var/www/html --allow-root; do # TODO Confirmar que funciona
  echo "Waiting for database…"
  sleep 2
done
echo "MariaDB is ready!"

# If WordPress not yet installed, setup WordPress (core install, user creation)
if ! wp core is-installed --path=/var/www/html --allow-root; then
	echo "Downloading & Installing WordPress..."

	# Core install and settings
	wp core install \
		--url="${WP_URL}" \
		--title="${COMPOSE_PROJECT_NAME}" \
		--admin_user="$WP_ADMIN" \
		--admin_password="$WP_ADMIN_PASS" \
		--admin_email="$WP_ADMIN_EMAIL" \
		--path=/var/www/html \
		--skip-email \
		--allow-root
	# Create user (non-admin)
	wp user create \
		"$WP_USER" "$WP_USER_EMAIL" \
		--role=editor \
		--user_pass="$WP_USER_PASS" \
		--path=/var/www/html \
		--allow-root
	# Ensures WordPress’ internal URLs match the container’s environment
	wp option update siteurl	"${WP_URL}" --path=/var/www/html --allow-root
	wp option update home			"${WP_URL}" --path=/var/www/html --allow-root

	echo "WordPress installed!"
else
	echo "WordPress is already installed."
fi

# PHP-FPM version 8.2 (foreground)
exec php-fpm8.2 -F