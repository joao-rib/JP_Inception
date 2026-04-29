"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { syncGameState } from "@/app/components/chess_game/reducer/actions/game";
import { clearOnlineGameSession } from "../utils/onlineGameSession";

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

type GameChatMessage = {
  id: string;
  username: string;
  text: string;
  sentAt: string;
};

type GameChatAck = {
  ok: boolean;
  error?: string;
};

const isFinishedGameStatus = (status: unknown) => {
  return typeof status === "string" && status !== "" && status !== "Ongoing";
};

export function useOnlineGameSync({ appState, dispatch, gameId, playerId, playerToken, username }: UseOnlineGameSyncParams) {
  const socketRef = useRef<Socket | null>(null);
  const hasHydratedFromServerRef = useRef(false);
  const lastSyncedMovesCountRef = useRef(0);
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
  const [isGameReady, setIsGameReady] = useState(false);
  const [chatMessages, setChatMessages] = useState<GameChatMessage[]>([]);
  const [chatConnectedPlayers, setChatConnectedPlayers] = useState(0);
  const [chatStatus, setChatStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [gameError, setGameError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId || !playerId || !playerToken || !username) {
      return;
    }

    // Reset state for new game
    hasHydratedFromServerRef.current = false;
    lastSyncedMovesCountRef.current = 0;
    const socket = io(getChessUrl(), {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
      auth: { gameId, playerId, playerToken, username },
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.io.on("reconnect_attempt", () => {
      setChatStatus("connecting");
    });

    socket.on("connect", () => {
      setChatStatus("connected");
      setGameError(null);
      socket.emit("join-game", { gameId, playerId, playerToken, username });
    });

    socket.on("game-state", (payload: { playerColor?: "w" | "b"; boardState?: Record<string, unknown> }) => {
      if (payload?.playerColor === "w" || payload?.playerColor === "b") {
        setPlayerColor(payload.playerColor);
      }

      if (!payload?.boardState) {
        return;
      }

      if (isFinishedGameStatus(payload.boardState.status)) {
        clearOnlineGameSession();
      }

      // Track how many moves the server has so we don't echo them back
      if (Array.isArray(payload.boardState.movesList)) {
        lastSyncedMovesCountRef.current = payload.boardState.movesList.length;
      }

      if (!hasHydratedFromServerRef.current) {
        hasHydratedFromServerRef.current = true;
        setIsGameReady(true);
      }

      dispatch(syncGameState(payload.boardState));
    });

    socket.on("game-error", (payload?: { error?: string }) => {
      setGameError(payload?.error ?? "Unable to reconnect to this game.");
      setIsGameReady(false);
      setPlayerColor(null);
      clearOnlineGameSession();
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      hasHydratedFromServerRef.current = false;
      setIsGameReady(false);
      setChatStatus("disconnected");
      setChatConnectedPlayers(0);
    });

    socket.on("connect_error", () => {
      setChatStatus("disconnected");
      setChatConnectedPlayers(0);
    });

    socket.on("game-chat-sync", (payload: { connectedPlayers?: number; recentMessages?: GameChatMessage[] }) => {
      setChatConnectedPlayers(payload.connectedPlayers ?? 0);
      setChatMessages(payload.recentMessages ?? []);
    });

    socket.on("game-chat-presence", (payload: { connectedPlayers?: number }) => {
      setChatConnectedPlayers(payload.connectedPlayers ?? 0);
    });

    socket.on("game-chat-message", (message: GameChatMessage) => {
      setChatMessages((previous) => [...previous, message].slice(-50));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      hasHydratedFromServerRef.current = false;
      lastSyncedMovesCountRef.current = 0;
      setPlayerColor(null);
      setIsGameReady(false);
      setChatMessages([]);
      setChatConnectedPlayers(0);
      setChatStatus("connecting");
      setGameError(null);
    };
  }, [dispatch, gameId, playerId, playerToken, username]);

  useEffect(() => {
    if (!gameId || !playerId || !playerToken || !username || !socketRef.current?.connected || !hasHydratedFromServerRef.current) {
      return;
    }

    // Only emit when we have a NEW local move beyond what was last synced from server
    if (appState.movesList.length <= lastSyncedMovesCountRef.current) {
      return;
    }

    lastSyncedMovesCountRef.current = appState.movesList.length;

    socketRef.current.emit("sync-game-state", {
      boardState: appState,
      gameId,
      playerId,
      playerToken,
      username,
    });
  }, [appState.movesList.length, appState.status, appState.turn, gameId, playerId, playerToken, username]);

  const resignGame = () => {
    if (!socketRef.current?.connected) {
      return;
    }

    clearOnlineGameSession();
    socketRef.current.emit("resign-game", {
      gameId,
      playerId,
      playerToken,
    });
  };

  const sendChatMessage = (text: string) => {
    return new Promise<boolean>((resolve) => {
      if (!socketRef.current?.connected) {
        resolve(false);
        return;
      }

      socketRef.current.emit("game-chat-message", { text }, (ack: GameChatAck) => {
        resolve(Boolean(ack?.ok));
      });
    });
  };

  return {
    isOnlineGame: Boolean(gameId && playerId && playerToken && username),
    isGameReady,
    playerColor,
    resignGame,
    chatMessages,
    chatConnectedPlayers,
    chatStatus,
    gameError,
    sendChatMessage,
  };
}
