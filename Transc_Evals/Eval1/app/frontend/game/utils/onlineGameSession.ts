"use client";

export type OnlineGameSession = {
  gameId: string;
  playerId: string;
  playerToken: string;
  username: string;
  updatedAt: number;
};

const STORAGE_KEY = "ft-transcendence-online-game-session-v1";

const hasWindow = () => typeof window !== "undefined";

const normalizeString = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

export const saveOnlineGameSession = (session: {
  gameId: string;
  playerId: string;
  playerToken: string;
  username: string;
}) => {
  if (!hasWindow()) {
    return;
  }

  const normalized = {
    gameId: normalizeString(session.gameId),
    playerId: normalizeString(session.playerId),
    playerToken: normalizeString(session.playerToken),
    username: normalizeString(session.username),
  };

  if (!normalized.gameId || !normalized.playerId || !normalized.playerToken || !normalized.username) {
    return;
  }

  const payload: OnlineGameSession = {
    ...normalized,
    updatedAt: Date.now(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const getOnlineGameSession = (): OnlineGameSession | null => {
  if (!hasWindow()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OnlineGameSession>;
    const gameId = normalizeString(parsed.gameId);
    const playerId = normalizeString(parsed.playerId);
    const playerToken = normalizeString(parsed.playerToken);
    const username = normalizeString(parsed.username);

    if (!gameId || !playerId || !playerToken || !username) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      gameId,
      playerId,
      playerToken,
      username,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const clearOnlineGameSession = () => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

export const buildOnlineGameUrl = (session: Pick<OnlineGameSession, "gameId" | "playerId" | "playerToken" | "username">) => {
  const params = new URLSearchParams({
    gameId: session.gameId,
    playerId: session.playerId,
    playerToken: session.playerToken,
    username: session.username,
  });

  return `/game?${params.toString()}`;
};
