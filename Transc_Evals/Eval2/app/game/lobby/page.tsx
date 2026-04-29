"use client";

import GameBackground from "../../frontend/game/components/GameBackground";
import GameFriendsPanel from "../../frontend/game/components/GameFriendsPanel";
import GameMatchSection from "../../frontend/game/components/GameMatchSection";
import GamePlayerSidebar from "../../frontend/game/components/GamePlayerSidebar";
import GameSettingsPanel from "../../frontend/game/components/GameSettingsPanel";
import { useGameController } from "../../frontend/game/hooks/useGameController";

/**
 * Lobby page.
 *
 * This page:
 * 1. Gets state and handlers from useGameController.
 * 2. Passes player data into GamePlayerSidebar.
 * 3. Keeps profile and action sections separated in the layout.
 */
export default function GamePage() {
  const {
    boardTheme,
    closeFriends,
    closeSettings,
    friends,
    friendSearchMessage,
    friendSearchQuery,
    friendSearchResults,
    handleAddFriend,
    handleFriendSearch,
    handleBoardThemeChange,
    playerName,
    playerStats,
    handleDisconnect,
    handleFriends,
    handleSettings,
    handleRankings,
    handleStartGame,
    isFriendsOpen,
    isFriendsLoading,
    isSearching,
    isSettingsOpen,
    matchStatus,
    setFriendSearchQuery,
  } = useGameController();

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <GameBackground />

      <div className="relative z-10 flex min-h-screen">
        <GamePlayerSidebar
          playerName={playerName}
          rating={playerStats.rating}
          wins={playerStats.wins}
          losses={playerStats.losses}
          onFriends={handleFriends}
          onSettings={handleSettings}
          onDisconnect={handleDisconnect}
        />

        <div className="relative flex flex-col flex-1">
          <GameMatchSection
            isSearching={isSearching}
            matchStatus={matchStatus}
            onRankings={handleRankings}
            onStartGame={handleStartGame}
          />
          <GameFriendsPanel
            isOpen={isFriendsOpen}
            friends={friends}
            friendSearchMessage={friendSearchMessage}
            friendSearchQuery={friendSearchQuery}
            friendSearchResults={friendSearchResults}
            isLoading={isFriendsLoading}
            onAddFriend={handleAddFriend}
            onClose={closeFriends}
            onFind={handleFriendSearch}
            onQueryChange={setFriendSearchQuery}
          />
          <GameSettingsPanel
            isOpen={isSettingsOpen}
            boardTheme={boardTheme}
            onBoardThemeChange={handleBoardThemeChange}
            onClose={closeSettings}
          />
        </div>
      </div>
    </div>
  );
}