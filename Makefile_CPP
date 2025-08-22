NAME = RPN
CPP = c++
FLAGS = -Wall -Werror -Wextra -std=c++98
MAIN = main.cpp
SRC = RPN.cpp
RM = rm -fr

all: $(NAME)

$(NAME): $(SRC) $(MAIN) 
	@$(CPP) $(FLAGS) $(SRC) $(MAIN) -o $(NAME)

clean:
	@$(RM) $(NAME)

fclean: clean

re: fclean all

.PHONY: all clean fclean re
