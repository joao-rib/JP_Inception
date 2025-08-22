NAME = cub3d
CC = cc
FLAGS = -Wall -Wextra -Werror
RM = rm -fr
MAIN = cub3d.c
FILES = Utils/loading.c Utils/loading2.c Utils/rendering.c Utils/rendering2.c Utils/rendering3.c Utils/moving.c \
		Utils/validating.c Utils/flood_fill_cub3d.c Utils/destroying.c Utils/error_handling.c Utils/moving_screen.c \
		cub3d.c
OBJ_SRC = loading.o loading2.o rendering.o rendering2.o rendering3.o moving.o \
		validating.o flood_fill_cub3d.o destroying.o error_handling.o moving_screen.o cub3d.o
OBJ = obj/loading.o obj/loading2.o obj/rendering.o obj/rendering2.o obj/rendering3.o obj/moving.o \
		obj/validating.o obj/flood_fill_cub3d.o obj/destroying.o obj/error_handling.o obj/moving_screen.o obj/cub3d.o
LIBFT = ./libft
MINILIBX = ./include/mlx/minilibx-linux
MLXFLAGS = -lmlx -lXext -lX11
WBLOCK = --no-print-directory

all: $(NAME)

#mlx:
#	git clone https://github.com/42Paris/minilibx-linux.git ./include/mlx
#	make -C ./include/mlx

$(NAME): $(OBJ)
	@$(CC) $(FLAGS) $(OBJ) -L $(LIBFT) -lft -L $(MINILIBX) $(MLXFLAGS) -lm -o $(NAME)

$(OBJ): $(MAIN) $(FILES)
	@mkdir -p include/mlx
	@tar -xzf minilibx-linux.tgz -C include/mlx
	@make -C $(MINILIBX) -s
	@make $(WBLOCK) -C $(LIBFT) all
	@mkdir -p obj
	@$(CC) $(FLAGS) -c $(FILES)
	@mv $(OBJ_SRC) obj/

clean:
	@$(RM) $(OBJ) obj
	@make $(WBLOCK) clean -C $(LIBFT)
	@make clean -C $(MINILIBX) -s

fclean:
	@$(RM) $(OBJ) $(NAME) obj
	@make $(WBLOCK) fclean -C $(LIBFT)
	@make clean -C $(MINILIBX) -s
	@$(RM) include/mlx

re: fclean all

.PHONY: all clean fclean re