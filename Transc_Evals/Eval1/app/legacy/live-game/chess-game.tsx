"use client";

import { useEffect, useState } from "react";
import Board from "@/app/components/chess_game/Board";
import GameChat from "./game-chat";
import { useChessSocket } from "./useChessSocket";

interface ChessGameProps {
  gameId: string;
  username: string;
}

export default function ChessGame({ gameId, username }: ChessGameProps) {
  const {
    status,
    gameState,
    error,
    players,
    gameMessages,
    sendGameMessage,
    resignFromGame,
  } = useChessSocket(gameId, username);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chess Game</h1>
        <div className="flex items-center gap-4">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              status === "connected"
                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                : status === "connecting"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
            }`}
          >
            {status}
          </span>
          <span className="text-sm text-foreground/80">{players.length} players</span>
        </div>
      </header>

      {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna Principal - Tabuleiro + info do jogo */}
        <div className="lg:col-span-3 space-y-6">
          {/* Board */}
          <div className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/15">
            <div className="max-w-md mx-auto">
              <Board />
            </div>
          </div>

          {/* Game Info */}
          {gameState && (
            <div className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/15 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-foreground/70">White Player</p>
                  <p className="font-semibold">{gameState.whitePlayer}</p>
                </div>
                <div>
                  <p className="text-foreground/70">Black Player</p>
                  <p className="font-semibold">{gameState.blackPlayer}</p>
                </div>
                <div>
                  <p className="text-foreground/70">Current Turn</p>
                  <p className="font-semibold capitalize">{gameState.currentTurn}</p>
                </div>
                <div>
                  <p className="text-foreground/70">Status</p>
                  <p className="font-semibold capitalize">{gameState.status}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Moves: {gameState.moves.length}</p>
                {gameState.status === "playing" && (
                  <button
                    onClick={resignFromGame}
                    className="w-full rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700/50 dark:text-red-300 dark:hover:bg-red-900/20"
                  >
                    Resign
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coluna Lateral - Chat do Jogo */}
        <div className="lg:col-span-1 space-y-6">
          {/* Game Chat */}
          <GameChat
            messages={gameMessages}
            isConnected={status === "connected"}
            onSendMessage={sendGameMessage}
            username={username}
          />
        </div>
      </div>
    </main>
  );
}
