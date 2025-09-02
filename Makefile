all: up

up:
	@mkdir -p /home/joao-rib/data/{wordpress,mariadb}
	@cd srcs && docker-compose up -d --build

down:
	@cd srcs && docker-compose down

clean:
	@cd srcs && docker-compose down -v

fclean: clean
	@cd srcs && docker-compose rm -f
	@docker system prune -a
	@sudo rm -rf /home/joao-rib/data

re: clean up

.PHONY: up down build clean fclean re
