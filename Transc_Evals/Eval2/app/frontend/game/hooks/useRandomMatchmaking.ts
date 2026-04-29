"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { buildOnlineGameUrl, saveOnlineGameSession } from "../utils/onlineGameSession";

const MATCHMAKING_NAMESPACE = "/matchmaking";

type MatchFoundPayload = {
  gameId: string;
  playerId: string;
  playerToken: string;
  username: string;
};

const getMatchmakingUrl = () => {
  if (typeof window === "undefined") {
    return MATCHMAKING_NAMESPACE;
  }

  return `${window.location.origin}${MATCHMAKING_NAMESPACE}`;
};

export function useRandomMatchmaking() {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matchStatus, setMatchStatus] = useState("");

  const disconnectSocket = () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  };

  const cancelMatchmaking = () => {
    socketRef.current?.emit("cancel-queue");
    disconnectSocket();
    setIsSearching(false);
    setMatchStatus("");
  };

  const routeToActiveGame = ({ gameId, playerId, playerToken, username }: MatchFoundPayload) => {
    saveOnlineGameSession({ gameId, playerId, playerToken, username });
    router.push(buildOnlineGameUrl({ gameId, playerId, playerToken, username }));
  };

  const startMatchmaking = (playerName: string) => {
    if (isSearching) {
      cancelMatchmaking();
      return;
    }

    const socket = io(getMatchmakingUrl(), {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
    });

    socketRef.current = socket;
    setIsSearching(true);
    setMatchStatus("Connecting to matchmaking...");

    socket.on("connect", () => {
      socket.emit("join-queue", { username: playerName });
    });

    socket.on("queue-joined", () => {
      setMatchStatus("Waiting for another player...");
    });

    socket.on("active-game", (payload: MatchFoundPayload) => {
      disconnectSocket();
      setIsSearching(false);
      setMatchStatus("Resuming your active game...");
      routeToActiveGame(payload);
    });

    socket.on("match-found", (payload: MatchFoundPayload) => {
      disconnectSocket();
      setIsSearching(false);
      setMatchStatus("");
      routeToActiveGame(payload);
    });

    socket.on("disconnect", () => {
      setMatchStatus("Connection interrupted. Trying again...");
    });

    socket.on("connect_error", () => {
      setMatchStatus("Unable to reach matchmaking server.");
    });
  };

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return {
    cancelMatchmaking,
    isSearching,
    matchStatus,
    startMatchmaking,
  };
}
