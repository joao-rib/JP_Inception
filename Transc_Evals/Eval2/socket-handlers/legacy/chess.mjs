import crypto from "node:crypto";
import { trimText } from "./utils.mjs";

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function registerChessNamespace(io) {
  const chessGames = new Map();
  const chessNamespace = io.of("/chess");

  const initializeGame = (gameId, player1, player2) => {
    const game = {
      gameId,
      status: "playing",
      whitePlayer: player1,
      blackPlayer: player2,
      currentTurn: "white",
      moves: [],
      fen: INITIAL_FEN,
      createdAt: new Date(),
      messages: [],
    };

    chessGames.set(gameId, game);
    return game;
  };

  const getOrCreateGame = (gameId, username) => {
    if (chessGames.has(gameId)) {
      return chessGames.get(gameId);
    }

    return initializeGame(gameId, username, "waiting-opponent");
  };

  chessNamespace.on("connection", (socket) => {
    const gameId = socket.handshake.query.gameId;
    const username = socket.handshake.query.username || `player-${socket.id.slice(0, 6)}`;

    socket.data.username = username;
    socket.data.gameId = gameId;

    socket.on("join-game", () => {
      const game = getOrCreateGame(gameId, username);

      if (game.blackPlayer === "waiting-opponent") {
        game.blackPlayer = username;
        game.status = "playing";
      }

      socket.join(gameId);

      chessNamespace.to(gameId).emit("game-state", game);
      chessNamespace.to(gameId).emit("player-joined", {
        username,
        players: [game.whitePlayer, game.blackPlayer].filter((player) => player !== "waiting-opponent"),
      });
    });

    socket.on("make-move", (payload, acknowledge) => {
      const { from, to } = payload;
      const game = chessGames.get(gameId);

      if (!game) {
        if (typeof acknowledge === "function") {
          acknowledge({ ok: false, error: "Game not found" });
        }
        return;
      }

      const isWhiteTurn = game.currentTurn === "white";
      const isPlayerWhite = game.whitePlayer === username;

      if (isWhiteTurn !== isPlayerWhite) {
        if (typeof acknowledge === "function") {
          acknowledge({ ok: false, error: "Not your turn" });
        }
        return;
      }

      const move = {
        from,
        to,
        timestamp: new Date().toISOString(),
      };

      game.moves.push(move);
      game.currentTurn = isWhiteTurn ? "black" : "white";

      chessNamespace.to(gameId).emit("move-executed", move);

      if (typeof acknowledge === "function") {
        acknowledge({ ok: true });
      }
    });

    socket.on("game-chat-message", (payload, acknowledge) => {
      const text = trimText(payload?.text, 200);
      const game = chessGames.get(gameId);

      if (!game) {
        if (typeof acknowledge === "function") {
          acknowledge({ ok: false, error: "Game not found" });
        }
        return;
      }

      if (!text) {
        if (typeof acknowledge === "function") {
          acknowledge({ ok: false, error: "Empty message" });
        }
        return;
      }

      const message = {
        id: crypto.randomUUID(),
        gameId,
        username,
        text,
        sentAt: new Date().toISOString(),
      };

      game.messages.push(message);
      chessNamespace.to(gameId).emit("game-chat-message", message);

      if (typeof acknowledge === "function") {
        acknowledge({ ok: true });
      }
    });

    socket.on("resign-game", () => {
      const game = chessGames.get(gameId);

      if (!game) return;

      const winner = game.whitePlayer === username ? game.blackPlayer : game.whitePlayer;
      game.status = "finished";

      chessNamespace.to(gameId).emit("game-finished", {
        winner,
        reason: `${username} resigned`,
      });
    });

    socket.on("disconnect", () => {
      const game = chessGames.get(gameId);
      const players = chessNamespace.adapter.rooms.get(gameId)
        ? Array.from(chessNamespace.adapter.rooms.get(gameId))
        : [];

      if (game) {
        chessNamespace.to(gameId).emit("player-left", {
          username,
          players: players.map((socketId) => {
            const sock = chessNamespace.sockets.get(socketId);
            return sock?.data.username || "unknown";
          }),
        });
      }
    });
  });

  return chessNamespace;
}
