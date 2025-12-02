ifneq ("$(wildcard src/.env)", "")
	include src/.env
	export
endif

ENV_LIST := \
	DOMAIN_NAME \
	DATA_PATH \
	COMPOSE_PATH \
	COMPOSE_PROJECT_NAME \
	SECRETS_DIR \
	SECRETS_FILES \
	DB_HOST \
	DB_USER \
	DB_NAME \
	WP_ADMIN \
	WP_ADMIN_EMAIL \
	WP_USER \
	WP_USER_EMAIL

# Validate all env variables
$(foreach var,$(ENV_LIST), $(if $(value $(var)),,$(error Environment variable is either missing or empty: $(var))))

# Expand shell variables inside DATA_PATH
#DATA_PATH := $(shell eval echo $(DATA_PATH))

# Extracts every image in the yml file, saves it in IMAGES
IMAGES := $(shell yq '.services[].image' $(COMPOSE_PATH) 2>/dev/null)

all: up

up: precheck data set-host
	@docker compose -f $(COMPOSE_PATH) up -d
	@docker ps -a
	@docker volume ls
	@docker network ls

up_build: build up

build: precheck
	@docker compose -f $(COMPOSE_PATH) build --no-cache

debug: up logs

logs: precheck
	@docker compose -f $(COMPOSE_PATH) logs -f --tail=100

down: precheck
	@docker compose -f $(COMPOSE_PATH) down --remove-orphans --volumes

restart: down up

restart_debug: down debug

restart_fclean: fclean up

data_clean:
	@if [ -d $(DATA_PATH) ]; then \
		$(call CHECK_SUDO); \
		echo "Removing data directory $(DATA_PATH) ..."; \
		sudo rm -rf $(DATA_PATH); \
		echo "Successfully removed data directory $(DATA_PATH)"; \
	fi

clean: down
	@for image in $(IMAGES); do \
		if docker image inspect $$image >/dev/null 2>&1; then \
			docker image rm $$image; \
		fi; \
	done

fclean: unset-host clean data_clean
	@docker builder prune -f

## HELPER FUNCTIONS
# Create necessary local directories
data:
	@for path in $(shell yq '.volumes[].driver_opts.device' $(COMPOSE_PATH)); do \
		expanded_path=$$(eval echo $$path); \
		if [ ! -d "$$expanded_path" ]; then \
			echo "Creating directory $$expanded_path ..."; \
			mkdir -p "$$expanded_path"; \
			echo "Successfully created $$expanded_path"; \
		fi; \
	done

# Validate that user has sudo privileges
define CHECK_SUDO
  sudo -n true 2>/dev/null || { \
    echo "Error: Sudo privileges are required run this command."; \
    exit 1; \
  }
endef

# Add domain name to /etc/hosts (unless it already exists)
set-host:
	@grep -q "$(DOMAIN_NAME)" /etc/hosts || { \
		$(call CHECK_SUDO); \
		echo "Adding $(DOMAIN_NAME) to host Group ..."; \
		sudo sh -c 'echo "127.0.0.1 $(DOMAIN_NAME)" >> /etc/hosts'; \
		echo "Successfully added $(DOMAIN_NAME) to host Group (/etc/hosts)"; \
	}

# Removes domain name from /etc/hosts
unset-host:
	@if grep -q "$(DOMAIN_NAME)" /etc/hosts; then \
		$(call CHECK_SUDO); \
		echo "Removing $(DOMAIN_NAME) from host Group ..."; \
		sudo sed -i "/$(DOMAIN_NAME)/d" /etc/hosts; \
		echo "Successfully removed $(DOMAIN_NAME) from host Group (/etc/hosts)"; \
	fi

# Validate that all tools are installed
precheck_tools:
	@missing=0; \
	for tool in docker yq; do \
		if ! command -v $$tool >/dev/null 2>&1; then \
			echo "Error: Could not find required tool ($$tool)"; \
			missing=1; \
		fi; \
	done; \
	[ $$missing -eq 0 ]

# Validate that secrets directory exists, and that each file exists and is non‐empty
precheck_secrets:
	@if [ ! -d "$(SECRETS_DIR)" ]; then \
		echo "Error: Could not find secrets directory ($(SECRETS_DIR))"; \
		exit 1; \
	fi; \
	missing=0; \
	for f in $(SECRETS_FILES); do \
		if [ ! -s "$(SECRETS_DIR)/$$f" ]; then \
			echo "Error: Secrets file missing or empty in $(SECRETS_DIR)/$$f"; \
			missing=1; \
		fi; \
	done; \
	[ $$missing -eq 0 ]

precheck: precheck_tools precheck_secrets

help:
	@echo "Makefile Inception Commands:"
	@echo "	up 				: Start containers (detached mode)"
	@echo "	build			: (Re)Build all images (no cache)"
	@echo "	up_build		: build+up - (Re)Build images before starting containers (detached mode)"
	@echo "	logs			: Follow logs of current running containers"
	@echo "	debug			: up+logs - Start containers (detached mode) and follow logs"
	@echo "	down			: Stop and remove all containers, volumes, and orphans"
	@echo "	restart			: down+up - Stop and then start containers once again"
	@echo "	restart_debug	: down+debug - Stop and start, then follow logs"
	@echo "	clean			: Remove built images only"
	@echo "	data_clean		: Remove persistent data (requires sudo)"
	@echo "	fclean			: clean+data_clean - Remove images and all persistent data (requires sudo)"
	@echo "	restart_fclean	: fclean+up - Full cleanup and start fresh"
	@echo "	help			: Shows the index you're reading :3"

.PHONY: all up build debug logs down restart restart_debug restart_fclean \
	data_clean clean fclean data set-host precheck help