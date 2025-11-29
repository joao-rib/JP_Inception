##----------------------
## Erik

#!/bin/sh
set -e

if [ ! -d "/var/lib/mysql/mysql" ]; then
	echo "Initialising MariaDB"
	DB_ROOT_PASS=$(cat /run/secrets/dbrootpass)
	WP_DB_PASS=$(cat /run/secrets/dbpass)

	mariadb-install-db --user=mysql --datadir=/var/lib/mysql
	chown -R mysql:mysql /var/lib/mysql

	su-exec mysql mariadbd \
		--datadir=/var/lib/mysql \
		--skip-networking --socket=/tmp/mysql.sock &
	pid="$!"
	
	until mysqladmin ping --socket=/tmp/mysql.sock --silent; do
		sleep 1
	done

	mysql -u root --socket=/tmp/mysql.sock <<-EOSQL
ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_ROOT_PASS';
CREATE DATABASE IF NOT EXISTS \`$WP_DB_NAME\`;
CREATE USER IF NOT EXISTS '$WP_DB_USER'@'%' IDENTIFIED BY '$WP_DB_PASS';
GRANT ALL PRIVILEGES ON \`$WP_DB_NAME\`.* TO '$WP_DB_USER'@'%';
FLUSH PRIVILEGES;
EOSQL

	kill "$pid"
fi

exec su-exec mysql mariadbd \
	--datadir=/var/lib/mysql --bind-address=0.0.0.0

##----------------------
## Leo

#!/bin/bash

# Copy the init.sql file to gain access to it
if [ -f /etc/mysql/init.sql ]; then
  export MYSQL_ROOT_PASSWORD="$(< /run/secrets/db_root_password)" && \
  export MYSQL_PASSWORD="$(< /run/secrets/db_password)" && \
  envsubst < /etc/mysql/init.sql > /tmp/init.sql
  chown mysql:mysql /tmp/init.sql
  chmod 660       /tmp/init.sql
else
  echo "No init.sql file found in /etc/mysql"
  exit 1
fi

exec mariadbd