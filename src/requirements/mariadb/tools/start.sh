#!/bin/bash

# If any command returns non-zero (error), then exit
set -e

# If MariaDB not yet installed, setup Maria DB (core install, user creation)
if [ -f /etc/mysql/init.sql ]; then
	echo "Initialising MariaDB"

	# Exports and interpolates into /tmp/init.sql
	# If something fails, the env variables will not be exported
	export MYSQL_ROOT_PASSWORD="$(cat /run/secrets/dbroot_password)" && \
	export MYSQL_PASSWORD="$(cat /run/secrets/db_password)" && \
	envsubst < /etc/mysql/init.sql > /tmp/init.sql
	# Defines mysql owner and permissions
	chown mysql:mysql	/tmp/init.sql
	chmod 660	/tmp/init.sql

else
	echo "No init.sql file found in /etc/mysql"
	exit 1
fi

exec mariadbd