--MariaDB installs with a root user without password. Attribute MYSQL_ROOT_PASSWORD to it;
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
--Create remote root user if none exists;
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
--If root user exists, guarantee correct password;
ALTER USER 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';

--Create database;
CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};
--Create default user for the database;
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';

--Reload permissions and privileges;
FLUSH PRIVILEGES;