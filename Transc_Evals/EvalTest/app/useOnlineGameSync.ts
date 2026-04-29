"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { syncGameState } from "@/app/components/chess_game/reducer/actions/game";

const CHESS_NAMESPACE = "/chess";

const getChessUrl = () => {
  // Socket.IO automatically uses the current origin, just pass the namespace
  return CHESS_NAMESPACE;
};

type UseOnlineGameSyncParams = {
  appState: {
    movesList: string[];
    status: string;
    turn: "w" | "b";
  } & Record<string, unknown>;
  dispatch: (action: unknown) => void;
  gameId: string | null;
  playerId: string | null;
  playerToken: string | null;
  username: string | null;
};

export function useOnlineGameSync({ appState, dispatch, gameId, playerId, playerToken, username }: UseOnlineGameSyncParams) {
  const socketRef = useRef<Socket | null>(null);
  const hasHydratedFromServerRef = useRef(false);
  const suppressNextSyncRef = useRef(false);
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
  const [isGameReady, setIsGameReady] = useState(false);

  useEffect(() => {
    if (!gameId || !playerId || !playerToken || !username) {
      return;
    }

    // Reset state for new game
    hasHydratedFromServerRef.current = false;
    suppressNextSyncRef.current = false;
    setPlayerColor(null);
    setIsGameReady(false);

    const socket = io(getChessUrl(), {
      transports: ["websocket", "polling"],
      reconnection: false, // Disable automatic reconnection; React will handle it
      auth: { gameId, playerId, playerToken, username },
      timeout: 20000, // 20 second timeout
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      // Small delay to ensure the server socket handlers are fully registered
      setTimeout(() => {
        socket.emit("join-game", { gameId, playerId, playerToken, username });
      }, 100);
    });

    socket.on("game-state", (payload: any) => {
      if (payload?.playerColor === "w" || payload?.playerColor === "b") {
        setPlayerColor(payload.playerColor);
      }

      if (!payload?.boardState) {
        return;
      }

      // First time receiving game state
      if (!hasHydratedFromServerRef.current) {
        hasHydratedFromServerRef.current = true;
        suppressNextSyncRef.current = true;
        setIsGameReady(true);
      }

      // Always sync the board state when receiving from server
      dispatch(syncGameState(payload.boardState));
    });

    socket.on("disconnect", (reason: any) => {
      hasHydratedFromServerRef.current = false;
      setIsGameReady(false);
    });

    return () => {
      console.log("[useOnlineGameSync] Cleanup: disconnecting socket", socketRef.current?.id);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      hasHydratedFromServerRef.current = false;
      suppressNextSyncRef.current = false;
      setPlayerColor(null);
      setIsGameReady(false);
    };
  }, [dispatch, gameId, playerId, playerToken, username]);

  useEffect(() => {
    if (!gameId || !playerId || !playerToken || !username || !socketRef.current?.connected || !hasHydratedFromServerRef.current) {
      return;
    }

    if (suppressNextSyncRef.current) {
      suppressNextSyncRef.current = false;
      return;
    }

    // Only sync if it's our turn (we just made a move)
    if (playerColor && appState.turn !== playerColor) {
      socketRef.current.emit("sync-game-state", {
        boardState: appState,
        gameId,
        playerId,
        playerToken,
        username,
      });
    }
  }, [appState.movesList.length, appState.turn, gameId, playerId, playerToken, username, playerColor]);

  const resignGame = () => {
    if (!socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit("resign-game", {
      gameId,
      playerId,
      playerToken,
    });
  };

  return {
    isOnlineGame: Boolean(gameId && playerId && playerToken && username),
    isGameReady,
    playerColor,
    resignGame,
  };
}
