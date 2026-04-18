# USER_DOC.md - Inception

## Description

The Inception project consists of building a small, web-like infrastructure by using Dockers. The goal is to store multiple services into containers and make them work together in a secure environment.

The services are:

* **Nginx**: A web server (of sorts) configured with HTTPS (TLS protocol)
* **WordPress**: A website management software (Content Management System), powered by PHP
* **MariaDB**: A database used by WordPress

Each service runs in its own container, communicating through the Docker network. These services running in the background are known as "images".
Persistent data is stored using volumes, which are bound to the host system (VM).

## Setup - Basic make commands

(First of all, Docker must be installed and the current user must belong to the `docker` group. Someone with sudo privileges should ensure these for the user)

Instead of running "make", like most projects seen so far, a Docker network typically requires "make up" to get started

In case the containers, images, etc. need to be rebuilt from the ground up, the adequate command is "make up_build".
Generally reserved when making significant changes to the Docker structure, as "build" takes a very long time to finish.

(Note: A stable internet access is required for either of these to work)

```bash
make up
make up_build
```

In order to stop the project, "make down" is typically used. This will stop the Dockers and respective volumes and containers.

```bash
make down
```

The 3 commands listed below deal with thorough cleanup duty. "clean" removes built images only, while "data_clean" removes persistent data still present on the machine. "fclean" does both.

```bash
make clean
make data_clean
make fclean
```

For additional commands or a simple refresher, feel free to type "make help", for a quick overview.

```bash
make help
```

## Docker Status and Management

While the project is already running, type the following, while inside the srcs folder:

```bash
docker compose ps
```

If all goes well, you should see information on all currently-running images (for this project: nginx, wordpress, and mariadb).
For added clarity, the fields "Created" and "Status" can be accurate to the second. If something goes wrong, and a service goes down and restarts for some reason, those fields will be the first ones to let the user know.
You can also confirm the one external port to the Docker Network: Port 443, via nginx, with a TCP protocol

In order to check logs (setup, installation, erros, etc.), you can use the following make command:

```bash
make logs
```

Which, in reality, is:

```bash
docker compose -f srcs/docker-compose.yml logs -f --tail=50
```

To check for a specific container, best to type out one of these:

```bash
docker logs nginx
docker logs wordpress
docker logs mariadb
```

## Credentials

The project's credentials are stored in:

* `/etc/.secrets/.env` (Environmental variables)
* `/etc/.secrets/*.txt` (Passwords)

During setup (make), these are respectively copied into:

```text
./secrets/
./srcs/.env
```

Note that env variables are fairly easy to discover, and not necessarily meant to be hidden. They are typically used to facilitate configuration and setup.

However, secrets are normally not ever meant to be visible (not even in metadata), as they refer to sensitive information, such as passwords. This project brings the folder to the forefront for didactical purposes only.

The secrets used for this project are:

* Database user password
* Database root password
* WordPress user password
* WordPress admin password

## The Wordpress Website

From inside the VM, open a browser of your choice and type one of the following on the address bar:

```text
https://joao-rib.42.fr
https://joao-rib.42.fr/wp-admin
```

The first one is meant for users. The second one is meant for administrators (use the administrator credentials).

The connection to the wordpress website can also be tested via the following command:

```bash
curl -v https://joao-rib.42.fr
```

If nothing is returned, the connection is stable.

---

## Database access

In order to access the database so that you may interact with it in mysql language, you should type:

```bash
docker exec -it mariadb mysql -u root -p
```

Then, type in the password.
Once you're in, you can type SQL commands, which must always end in ";". Here are some, to get you started:

```sql
SHOW DATABASES;
USE database_name;
SHOW TABLES;
SELECT * FROM table_name;
```

Have fun, as long as you don't break anything. This is persistent data, after all.
