"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { buildOnlineGameUrl, clearOnlineGameSession, getOnlineGameSession } from "../utils/onlineGameSession";
import { useBoardThemeSettings } from "./useBoardThemeSettings";
import { useRandomMatchmaking } from "./useRandomMatchmaking";

export function useGameController() {
  const router = useRouter();

  // Safe defaults prevent the UI from breaking before the fetch resolves.
  const [playerName, setPlayerName] = useState("Player");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState({
    rating: 0,
    wins: 0,
    losses: 0,
  });

  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [friends, setFriends] = useState<
    Array<{ id: string; name: string; status: "online" | "offline" }>
  >([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [friendSearchResults, setFriendSearchResults] = useState<
    Array<{ id: string; name: string; status: "online" | "offline"; isFriend?: boolean }>
  >([]);
  const [friendSearchMessage, setFriendSearchMessage] = useState<string | null>(null);
  const [isFriendsLoading, setIsFriendsLoading] = useState(false);
  const {
    boardTheme,
    closeSettings,
    handleBoardThemeChange,
    isSettingsOpen,
    toggleSettings,
  } = useBoardThemeSettings();
  const { isSearching, matchStatus, startMatchmaking } = useRandomMatchmaking();

  const updatePresence = useCallback(async (status: "ONLINE" | "OFFLINE") => {
    try {
      await fetch("/api/account/presence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("[useGameController] Presence update failed:", error);
    }
  }, []);

  const loadFriends = useCallback(async (options?: { background?: boolean }) => {
    const isBackground = options?.background ?? false;

    try {
      if (!isBackground) {
        setIsFriendsLoading(true);
      }

      const response = await fetch("/api/friends", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("[useGameController] Failed to fetch friends");
        return;
      }

      const data = (await response.json()) as {
        friends?: Array<{ id: string; name: string; status: "online" | "offline" }>;
      };

      setFriends(data.friends ?? []);
    } catch (error) {
      console.error("[useGameController] Error loading friends:", error);
    } finally {
      if (!isBackground) {
        setIsFriendsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const activeSession = getOnlineGameSession();

    if (activeSession) {
      router.replace(buildOnlineGameUrl(activeSession));
      return;
    }

    void updatePresence("ONLINE");

    const syncPresenceOnExit = () => {
      const payload = JSON.stringify({ status: "OFFLINE" });
      const body = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/account/presence", body);
    };

    const syncPresenceOnVisible = () => {
      if (document.visibilityState === "visible") {
        void updatePresence("ONLINE");
      }
    };

    window.addEventListener("beforeunload", syncPresenceOnExit);
    document.addEventListener("visibilitychange", syncPresenceOnVisible);

    return () => {
      window.removeEventListener("beforeunload", syncPresenceOnExit);
      document.removeEventListener("visibilitychange", syncPresenceOnVisible);
    };
  }, [router, updatePresence]);

  useEffect(() => {
    const loadLobbyPlayerData = async () => {
      try {
        const response = await fetch("/api/lobby/player", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          console.error("[useGameController] Failed to fetch player data");
          return;
        }

        const data = await response.json();
        // Response mapping:
        // Account.username -> playerName
        // Account.avatarUrl -> avatarUrl
        // Score.rating/wins/losses -> rating/wins/losses
        setPlayerName(data.playerName ?? "Player");
        setAvatarUrl(data.avatarUrl ?? null);
        setPlayerStats({
          rating: data.playerStats?.rating ?? 0,
          wins: data.playerStats?.wins ?? 0,
          losses: data.playerStats?.losses ?? 0,
        });
      } catch (error) {
        console.error("[useGameController] Error loading player data:", error);
      }
    };

    loadLobbyPlayerData();
    void loadFriends();
  }, [loadFriends]);

  useEffect(() => {
    const refreshFriends = () => {
      void loadFriends({ background: true });
    };

    const refreshOnFocus = () => {
      void loadFriends({ background: true });
    };

    const intervalId = window.setInterval(refreshFriends, 2000);
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [loadFriends]);

  const handleDisconnect = async () => {
    try {
      clearOnlineGameSession();
      await updatePresence("OFFLINE");

      // Sign out using NextAuth and redirect to login page
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("[useGameController] Error disconnecting:", error);
    }
  };

  const handleSettings = () => {
    console.log("Opening settings...");
  };

  const handleRankings = () => {
    router.push("/rankings");
  };

  const handleFriendSearch = async () => {
    try {
      setIsFriendsLoading(true);
      setFriendSearchMessage(null);

      const query = friendSearchQuery.trim();

      if (!query) {
        setFriendSearchResults([]);
        setFriendSearchMessage("Type at least one character to search users.");
        return;
      }

      const response = await fetch(`/api/friends?query=${encodeURIComponent(query)}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Friend search failed");
      }

      const data = (await response.json()) as {
        results?: Array<{ id: string; name: string; status: "online" | "offline"; isFriend?: boolean }>;
      };

      const results = data.results ?? [];
      setFriendSearchResults(results);
      setFriendSearchMessage(results.length > 0 ? null : "No users found with that prefix.");
    } catch (error) {
      console.error("[useGameController] Error searching friends:", error);
      setFriendSearchMessage("Could not search users right now.");
      setFriendSearchResults([]);
    } finally {
      setIsFriendsLoading(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      setIsFriendsLoading(true);
      const response = await fetch("/api/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        throw new Error("Friend add failed");
      }

      await loadFriends();

      if (friendSearchQuery.trim()) {
        await handleFriendSearch();
      }
    } catch (error) {
      console.error("[useGameController] Error adding friend:", error);
      setFriendSearchMessage("Could not add this user right now.");
    } finally {
      setIsFriendsLoading(false);
    }
  };


  const handleStartGame = () => {
    startMatchmaking(playerName);
  };

  const handleFriends = () => {
    void loadFriends({ background: true });
    setIsFriendsOpen((currentValue: boolean) => !currentValue);
  };

  const closeFriends = () => {
    setIsFriendsOpen(false);
  };

  return {
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
    handleDisconnect,
    handleFriends,
    handleRankings,
    handleStartGame,
    handleSettings: toggleSettings,
    isFriendsOpen,
    isFriendsLoading,
    isSearching,
    isSettingsOpen,
    matchStatus,
    playerName,
    playerStats,
    setFriendSearchQuery,
  };
}