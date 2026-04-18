DEV_DOC.md — Developer documentation This file must describe how a devel-
oper can:
◦ Set up the environment from scratch (prerequisites, configuration files, se-
crets).
◦ Build and launch the project using the Makefile and Docker Compose.
◦ Use relevant commands to manage the containers and volumes.
◦ Identify where the project data is stored and how it persists.

# DEV_DOC.md

## 🛠️ Development Setup Guide

This document explains how to set up, build, and manage the project from scratch as a developer.

---

## 📋 Prerequisites

Before starting, ensure the following tools are installed:

* **Docker**
* **Docker Compose** (plugin: `docker compose`)
* **yq** (for YAML parsing)
* **make**
* **sudo privileges**

---

## ⚙️ Environment Setup

### 📁 Required files and directories

The project expects a secrets directory at:

```text id="k9w3ds"
/etc/.secrets/
```

This directory must contain:

* `.env` → environment variables
* `db_password.txt`
* `dbroot_password.txt`
* `admin.txt`
* `credentials.txt`

---

### 🧾 Example `.env` variables

```env id="f0j91m"
DOMAIN_NAME=your-domain-name
DATA_PATH=/home/user/data
COMPOSE_PATH=./srcs/docker-compose.yml
COMPOSE_PROJECT_NAME=inception
SECRETS_DIR=/etc/.secrets
SECRETS_FILES=db_password.txt dbroot_password.txt admin.txt credentials.txt

DB_HOST=mariadb
DB_USER=wp_user
DB_NAME=wp_database

WP_ADMIN=admin
WP_ADMIN_EMAIL=admin@example.com
WP_USER=user
WP_USER_EMAIL=user@example.com
```

---

### 🔐 Secrets

Each `.txt` file must contain a single value:

* `db_password.txt` → WordPress DB user password
* `dbroot_password.txt` → MariaDB root password
* `admin.txt` → WordPress admin password
* `credentials.txt` → WordPress user password

---

## 🚀 Building and Launching

### ▶️ Start the project

```bash id="i1r5s2"
make up
```

* Creates required directories
* Copies secrets into the project
* Starts containers

---

### 🔁 Force rebuild

```bash id="8z8h8n"
make up_build
```

* Rebuilds all Docker images without cache
* Then starts containers

---

### 🧱 Build only

```bash id="c1y5bd"
make build
```

---

## 🧰 Managing Containers and Volumes

### 📦 View running containers

```bash id="l5kqzx"
docker ps
```

---

### 📜 View logs

```bash id="g3l9wx"
make logs
```

or:

```bash id="y1k9pv"
docker compose -f srcs/docker-compose.yml logs
```

---

### ⛔ Stop containers

```bash id="1r7m9n"
make down
```

---

### 🔄 Restart

```bash id="n8x5az"
make restart
```

---

### 🧹 Clean images

```bash id="g0z8px"
make clean
```

---

### 🧨 Full cleanup (images + data)

```bash id="w2m4ra"
make fclean
```

---

## 💾 Data Storage and Persistence

### 📍 Volume configuration

The project uses **bind mounts** defined in `docker-compose.yml`:

```yaml id="h8c6df"
device: ${DATA_PATH}/wordpress
device: ${DATA_PATH}/mariadb
```

---

### 📁 Data locations on host

* WordPress data:

  ```text id="4f7sdp"
  ${DATA_PATH}/wordpress
  ```

* MariaDB data:

  ```text id="q1w8az"
  ${DATA_PATH}/mariadb
  ```

---

### 🔁 Persistence behavior

* Data is stored **outside containers**

* Survives:

  * container restarts
  * `make down`

* Data is removed only with:

```bash id="v5p3re"
make data_clean
```

---

## 🧠 Additional Notes

* Containers communicate through a Docker network named `inception`
* Environment variables are injected via `.env`
* Secrets are mounted securely via Docker secrets
* MariaDB initialization runs via an `init.sql` script on first startup

---

## ✅ Summary

To set up from scratch:

1. Install dependencies (Docker, yq, make)
2. Create `/etc/.secrets/` and required files
3. Configure `.env`
4. Run:

```bash id="s9x2lm"
make up
```

The project will build and start all services automatically.

---
