#!/bin/bash

# If any command returns non-zero (error), then exit
set -e

# If MariaDB not yet installed, setup Maria DB (core install, user creation)
if [ -f /etc/mysql/init.sql ]; then
	echo "Initialising MariaDB"

	# Exports and interpolates into /var/lib/mysql/init.sql
	# If something fails, the env variables will not be exported
	export MYSQL_ROOT_PASSWORD="$(cat /run/secrets/dbroot_password)" && \
	export MYSQL_PASSWORD="$(cat /run/secrets/db_password)" && \
	envsubst < /etc/mysql/init.sql > /var/lib/mysql/init.sql
	# Defines mysql owner and permissions
	# TODO WIP previously /var/lib/mysql/init.sql used to be /tmp/init.sql
	chown mysql:mysql	/var/lib/mysql/init.sql
	chmod 660	/var/lib/mysql/init.sql

else
	echo "No init.sql file found in /etc/mysql"
	exit 1
fi

exec su -s /bin/bash mysql -c "mariadbd"
# TODO old command was exec mariadbd