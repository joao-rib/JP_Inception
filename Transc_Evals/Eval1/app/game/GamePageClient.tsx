'use client'

import { useEffect, useReducer } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Board from '@/app/components/chess_game/Board'
import CompactChat from '@/app/components/compact-chat'
import { initGameState } from '../components/chess_game/constants'
import Control from '../components/chess_game/Control/Control'
import TakeBack from '../components/chess_game/Control/bits/TakeBack'
import Resign from '../components/chess_game/Control/bits/Resign'
import { reducer } from '../components/chess_game/reducer/reducer'
import AppContext from '../contexts/Context'
import { useOnlineGameSync } from '../frontend/game/hooks/useOnlineGameSync'
import {
  buildOnlineGameUrl,
  clearOnlineGameSession,
  getOnlineGameSession,
  saveOnlineGameSession,
} from '../frontend/game/utils/onlineGameSession'
import { applyBoardTheme, getStoredBoardTheme } from '../frontend/game/utils/boardTheme'
import { useCrossTabGameSync } from './useCrossTabGameSync'

export default function GamePageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const gameId = searchParams.get('gameId')
  const playerId = searchParams.get('playerId')
  const playerToken = searchParams.get('playerToken')
  const username = searchParams.get('username')
  const [appState, dispatch] = useReducer(reducer, initGameState)

  useEffect(() => {
    applyBoardTheme(getStoredBoardTheme())
  }, [])

  useEffect(() => {
    const hasFullSessionInQuery = Boolean(gameId && playerId && playerToken && username)

    if (hasFullSessionInQuery) {
      saveOnlineGameSession({
        gameId: gameId as string,
        playerId: playerId as string,
        playerToken: playerToken as string,
        username: username as string,
      })
      return
    }

    const storedSession = getOnlineGameSession()
    if (!storedSession) {
      return
    }

    router.replace(buildOnlineGameUrl(storedSession))
  }, [gameId, playerId, playerToken, router, username])

  const onlineGame = useOnlineGameSync({
    appState,
    dispatch,
    gameId,
    playerId,
    playerToken,
    username,
  })

  useCrossTabGameSync(appState, dispatch, !onlineGame.isOnlineGame)
  
  // Don't render the game until online games have received playerColor from server.
  const isReadyToRender = !onlineGame.isOnlineGame || (onlineGame.isOnlineGame && onlineGame.playerColor !== null)

  const providerState = {
    appState,
    dispatch,
    onlineGame: {
      ...onlineGame,
      gameId,
      playerId,
      playerToken,
      username,
    },
  }

  const handleBackToLobby = () => {
    clearOnlineGameSession()
    router.push('/game/lobby')
  }

  return (
    <AppContext.Provider value={providerState}>
      <div className='App'>
        {onlineGame.isOnlineGame && onlineGame.gameError ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '10px' }}>
            <p>{onlineGame.gameError}</p>
            <button onClick={handleBackToLobby}>Back to lobby</button>
          </div>
        ) : onlineGame.isOnlineGame && !onlineGame.isGameReady ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Reconnecting to game...</p>
          </div>
        ) : !isReadyToRender ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Preparing game...</p>
          </div>
        ) : (
          <>
            <Board />
            <Control>
              {!onlineGame.isOnlineGame ? <TakeBack /> : null}
              <Resign />
              {onlineGame.isOnlineGame ? (
                <div style={{ marginTop: '12px', minWidth: '260px' }}>
                  <CompactChat
                    maxHeight='max-h-80'
                    connectedUsers={onlineGame.chatConnectedPlayers}
                    status={onlineGame.chatStatus}
                    messages={onlineGame.chatMessages}
                    onSendMessage={onlineGame.sendChatMessage}
                  />
                </div>
              ) : null}
            </Control>
          </>
        )}
      </div>
    </AppContext.Provider>
  )
}
