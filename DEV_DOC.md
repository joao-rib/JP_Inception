# DEV_DOC.md

## System Prerequisites

Before starting, ensure the following tools are installed:

* **Docker**
* **Docker Compose** (plugin: `docker compose`)
* **yq** (for YAML parsing)
* **make**

---

## Environment Setup

The project expects a secrets directory at:

```text
/etc/.secrets/
```

This directory must contain:

* `.env` - Stores environmental variables
* `db_password.txt` - Database password (user)
* `dbroot_password.txt` - Database password (root)
* `credentials.txt` - Wordpress password (user)
* `admin.txt` - Wordpress password (admin)

(Secrets are normally not ever meant to be visible (not even in metadata), as they refer to sensitive information. This project brings these files to the forefront for didactic purposes only).

### Required `.env` variables (example)

(The following values are mostly examples, and do not necessarily reflect the actual values used in this project)

```env
DOMAIN_NAME=my-42-login.42.fr
COMPOSE_PROJECT_NAME=inception
COMPOSE_PATH=./srcs/docker-compose.yml
DATA_PATH=/home/user/data
SECRETS_DIR=/etc/.secrets
SECRETS_FILES=db_password.txt dbroot_password.txt admin.txt credentials.txt

DB_HOST=mariadb
DB_USER=default_user
DB_NAME=default_database

WP_ADMIN=admin
WP_ADMIN_EMAIL=admin@example.com
WP_USER=user
WP_USER_EMAIL=user@example.com
```

## Project Setup

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
---

DEV_DOC.md — Developer documentation This file must describe how a devel-
oper can:
◦ Set up the environment from scratch (prerequisites, configuration files, se-
crets).
◦ Build and launch the project using the Makefile and Docker Compose.
◦ Use relevant commands to manage the containers and volumes.
◦ Identify where the project data is stored and how it persists.

## Data Storage

The project uses the following bind mounts (defined in `docker-compose.yml`):

```yaml
device: ${DATA_PATH}/wordpress
device: ${DATA_PATH}/mariadb
```

This way, data is stored outside of the containers, and persists even when you stop the project with `make down`.

In order to remove this persistent data, either of the following make commands will accomplish that goal:

```bash
make data_clean
make fclean
```
