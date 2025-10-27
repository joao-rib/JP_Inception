#Language: !/bin/sh

# If any command returns non-zero (error), then exit
set -e

# If MariaDB not yet installed, setup Maria DB (core install, user creation, etc.)
# TODO (Alpine) installs MariaDB directly // mariadb-install-db --user=mysql --datadir=/var/lib/mysql
# TODO (Debian) relies on a .sql script // envsubst < /etc/mysql/init.sql > /tmp/init.sql
if [ ! -d "/var/lib/mysql/mysql" ]; then
	echo "Initialising MariaDB" # TODO Mensagem debug

    # TODO (Alpine) Saves directly in env variables
	DB_ROOT_PASS=$(cat /run/secrets/dbrootpass)
	WP_DB_PASS=$(cat /run/secrets/dbpass)

    # TODO (Debian) Exports and interpolates into /etc/mysql/init.sql
    # export MYSQL_ROOT_PASSWORD="$(< /run/secrets/db_root_password)" && \
    # export MYSQL_PASSWORD="$(< /run/secrets/db_password)" && \
    # envsubst < /etc/mysql/init.sql > /tmp/init.sql

	mariadb-install-db --user=mysql --datadir=/var/lib/mysql
	chown -R mysql:mysql /var/lib/mysql # TODO Examinar mais

    # TODO - ALPINE
    # Starts MariaDB temporarily with networking disabled.
    # Waits for it to be ready using mysqladmin ping.
    # Runs inline SQL to:
    # Set root password.
    # Create WP database.
    # Create WP user with privileges.
    # Shuts down that temporary server (kill "$pid").

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

# (Alpine) Execute - TODO Examinar mais
exec su-exec mysql mariadbd \
	--datadir=/var/lib/mysql --bind-address=0.0.0.0

# (Debian) - exec mariadbd