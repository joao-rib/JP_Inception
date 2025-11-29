##----------------------
## Erik

#!/bin/bash
set -e

WP_ADMIN_PASS=$(</run/secrets/wpadmin)
WP_DB_PASS=$(</run/secrets/dbpass)
WP_USER_PASS=$(</run/secrets/wpuser)

echo "Waiting for MariaDB to be ready..."
until mysqladmin ping -h"$WP_DB_HOST" -u"$WP_DB_USER" -p"$WP_DB_PASS" --silent; do
	sleep 2
done
echo "MariaDB is ready!"

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

	echo "WordPress installed!"
else
	echo "WordPress is already installed."
fi

exec php-fpm83 -F

##----------------------
## Leo

#!/bin/bash

# Read passwords from Docker secrets
WP_ADMIN_PASS="$(cat /run/secrets/wp_admin_password)"
WP_USER_PASS="$(cat /run/secrets/wp_user_password)"

# Define Domain name
WP_URL="https://${DOMAIN_NAME}"

# Wait for DB to be ready
until wp db check --path=/var/www/html --allow-root; do
  echo "Waiting for database…"
  sleep 2
done

# If WP not yet installed, do core install & create user
if ! wp core is-installed --path=/var/www/html --allow-root; then
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
  wp option update siteurl "${WP_URL}" --path=/var/www/html --allow-root
  wp option update home    "${WP_URL}" --path=/var/www/html --allow-root

fi

exec "php-fpm7.4" "-F"