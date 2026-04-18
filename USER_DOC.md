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

Instead of running "make", like most projects seen so far, a Docker network typically requires "make up" to get started

In case the containers, images, etc. need to be rebuilt from the ground up, the adequate command is "make up_build".
Generally reserved when making significant changes to the Docker structure, as "build" takes a very long time to finish.

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

## Accessing the Wordpress website

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

---

◦ Check that the services are running correctly.

## 🧪 Checking Service Status

### 📦 Check running containers

While the project is already running, type the following, while inside the srcs folder:

```bash
docker ps
```

Expected:

* `nginx` → running
* `wordpress` → running
* `mariadb` → running

---

### 📜 View logs

```bash
make logs
```

or for a specific container:

```bash
docker logs nginx
docker logs wordpress
docker logs mariadb
```

---

### 🌐 Verify website

* Open browser inside VM
* Navigate to:

  ```
  https://<DOMAIN_NAME>
  ```

---

### 🗄️ Check database access

```bash
docker exec -it mariadb mysql -u root -p
```

---

## ⚠️ Notes

* Docker must be installed and the user must belong to the `docker` group.
* Internet connection is required for initial build (package installation).
* Services communicate through a Docker network named `inception`.

---

## ✅ Summary

This project provides:

* A secure HTTPS web server (Nginx)
* A dynamic website (WordPress)
* A relational database (MariaDB)

All components are containerized and orchestrated via Docker Compose for portability and reproducibility.

---
