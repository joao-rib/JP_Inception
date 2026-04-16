*This project has been created as part of the 42 curriculum by joao-rib*

---

# Inception

## Description

The Inception project consists of building a small, web-like infrastructure by using Dockers. The goal is to store multiple services into containers and make them work together in a secure environment.

The services are:

* **Nginx**: A web server (of sorts) configured with HTTPS (TLS protocol)
* **WordPress**: A website management software (Content Management System), powered by PHP
* **MariaDB**: A database used by WordPress

Each service runs in its own container, communicating through the Docker network. These services running in the background are known as "images".
Persistent data is stored using volumes, which are bound to the host system (VM).

## Instructions

### Prerequisites

* Docker
* Docker Compose (`docker compose`)
* make (Makefile)
* yq (yaml files)
* An adequately configured VM

### Setup - Basic make commands

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

### Accessing the Wordpress website

From inside the VM, open a browser of your choice and type one of the following on the address bar:

```text
https://joao-rib.42.fr
https://joao-rib.42.fr/wp-admin
```

The first one is meant for users. The second one is meant for administrators.

## Project Design

### Docker Overview

Docker is a daemon process that allows for compartmentalization (or containerization) of services by use of images. It guarantees that they function in isolation, and - if set up adequately - can be reproduced in multiple environments with relatively simple requirements.

A Docker is not the same thing as a Virtual Machine. VMs are meant to act as independent computers entirely, whereas Dockers function like distinct threads or processes, while still sharing the same host kernel. The services' autonomy is much "softer" than that of a whole VM (and much lighter on the hardware's resources as well).

Furthermore, Docker networks - that is, the web of connections between services - can be customised fairly easily using a configuration file. Communication and interactions between them can be made as open, or secure, or isolated as desired.

Each service (as well as respective connections) is defined in `docker-compose.yml` and built from custom Dockerfiles. Makefile runs the necessary commands to start the Dockers, as well guaranteeing prerequisites (such as the creation of folders to house persistent data).

### Data storage

The volumes created by the Docker services store necessary information to keep the services running, and may even be shared by more than one service at a time. They are light, flexible, and portable across machines (much like the Dockers themselves).

However, if the Docker stops running, all data stored in the volumes is likely lost. It is not meant to store permanent data. This could be a problem for dedicated databases, which are meant to store information as long as possible.

To store data in a more definite fashion, bind mounts are used. Bind mounts are, basically, connections to known paths and directories inside the machine running the dockers, dedicated to store permanent data (user records, passwords, etc).

For example, data stored via MariaDB is meant to be persistent, so bind mounts are used to save it. However, the mysql language used to run it is instead fetched and installed via Docker, and any information required to use it is instead stored in the dedicated volume.

### Project Structure

* `srcs/requirements/` - Dockerfiles and specific configurations
* `docker-compose.yml` - Service management
* `Makefile` - Project builder
* `env.` - Stores environmental variables
* `secrets/` - Secrets folder for credentials, only exists during runtime (copied from `/etc/.secrets`)
* `DATA_PATH/` - Persistent data, common between runs

Note that env variables are fairly easy to discover, and not necessarily meant to be hidden (they can even be seen via `docker inspect`). They are typically used to facilitate configuration and setup.

However, secrets are normally not ever meant to be visible (not even in metadata), as they refer to sensitive information, such as passwords. This project brings the folder to the forefront for didactical purposes only.

## Resources

### Documentation

The following guides are great starting points in order to learn the concepts behind Inception, starting to write an early draft of the config files, and even set up a VM that should be able to run it as smoothly as possible.

* [Inception - Basic Concepts](https://medium.com/@imyzf/inception-3979046d90a0)
* [Inception File Setup Guide - Part I](https://medium.com/@ssterdev/inception-guide-42-project-part-i-7e3af15eb671)
* [Inception File Setup Guide - Part II](https://medium.com/@ssterdev/inception-42-project-part-ii-19a06962cf3b)

### Regarding the use of AI

AI tools (such as ChatGPT) were used for:

* Delving into technical concepts (Docker networks, MariaDB interaction)
* Debugging container issues (permissions, prerequisites, proofreading)

All generated content was read with a substantial grain of salt, heavily tested and reviewed, and adapted to better fit the context of this project.
